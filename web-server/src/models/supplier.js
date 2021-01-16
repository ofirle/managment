const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');
const commissions_model = require('./commission');

const getSuppliers = (callback) => {
    mysql.connection.query(
        "SELECT s.*" +
        " FROM suppliers s" +
        " ORDER BY s.id ASC",
        function (err, results, fields) {
            if (err) throw err;
            results.forEach(parseSupplier);

            callback(results);
        });
};

const getSupplierInfo = (supplier_id, to_parse = false, callback) => {
    console.log("in getSupplierInfo. supplier: " + supplier_id);
    if(!supplier_id){
        callback(undefined);
    }else{
        mysql.connection.query(
            "SELECT s.*" +
            " FROM suppliers s" +
            " WHERE id=?" +
            " ORDER BY s.id ASC", [supplier_id],
            function (err, results, fields) {
                if (err) throw err;
                let info = results[0];
                if(to_parse){
                    parseSupplier(info);
                }
                const result = {"info": info};
                commissions_model.getCommissionsInfoBySupplier(supplier_id, (data) => {
                    result.commissions = data;
                    result.action_edit = true;
                    callback(result);
                });
            });
    }
};

const setSupplierInfo = (supplier_id, data, callback) => {
    console.log("in setSupplierInfo. supplier_id: " + supplier_id);
    let updated = false;
    getSupplierInfo(supplier_id,false,(old_data) => {
        if(old_data == null){
            callback({updated: false, data: 'SUPPLIER_NOT_FOUND'});
            return;
        }
        const fields = ['title', 'address', 'phone', 'contact_name', 'email', 'type'];
        let fields_changed = [];
        fields.forEach(function (item, index) {
            if(lib.isValueChanged(old_data[item], data[item])){
                fields_changed.push(item);
            }
        });

        if(fields_changed.length > 0){
            const {sql, values} = lib.buildSqlUpdate('suppliers', fields_changed, data, supplier_id);
            mysql.connection.query(sql, values,
                function (err, results) {
                    if (err){
                        console.log(err);
                        callback('Error');
                    }
                    if(results.affectedRows > 0){
                        console.log("updated");
                        callback({updated: true});
                    }else{
                        callback({updated: false});
                    }
                })
        }else{
            callback({updated: false});
        }
    });
};

const addSupplier = (data, callback) => {
    const fields = ['title', 'address', 'phone', 'contact_name', 'email', 'type'];
    const {sql, values} = lib.buildSqlCreate('suppliers', fields, data);
    mysql.connection.query(sql, values,
        function (err, results) {
            if (err) {
                console.log(err);
                callback('Error');
            }
            if (results.affectedRows > 0) {
                console.log("created");
                callback({created: true, id: results.insertId});
            } else {
                callback({updated: false});
            }
        });
};

function parseSupplier(item){
    item.type = base.parseLabelText(item.type, base.supplierTypeArray);
    if(!item.email){
        item.email = '---';
    }
    item.adate = base.parseDate(item.adate, true);
    if(!item.edate){
        item.edate = '---';
    }
}

const getSuppliersIds = (callback) => {
    console.log("in getSuppliersIds");
    mysql.connection.query(
        "SELECT s.id, s.title" +
        " FROM suppliers s",
        function (err, result, fields) {
            if (err) throw err;
            callback(result);
        });
};

module.exports = {
    getSuppliers: getSuppliers,
    getSupplierInfo: getSupplierInfo,
    setSupplierInfo: setSupplierInfo,
    getSuppliersIds: getSuppliersIds,
    addSupplier: addSupplier
};