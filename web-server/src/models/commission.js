const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');

const getCommissionInfo = (commission_id, to_parse = false, queries, callback) => {
    console.log("in getCommissionInfo. commission: " + commission_id);
    if(!commission_id){
        callback(queries);
    }else {
        mysql.connection.query(
            "SELECT id, project_id, supplier_id, payment_method, item_cost, item_description, percentage, bought_date, adate, edate" +
            " FROM commissions" +
            " WHERE id=? LIMIT 1", [commission_id],
            function (err, results) {
                if (err) throw err;
                let result = results[0];
                buildCommissionObject(result);
                if (to_parse) {
                    parseCommissionObject(result);
                }
                callback(result);
            }
        );
    }
};

const getCommissionsInfoByProject = (project_id, callback) => {
    mysql.connection.query(
        "SELECT c.id, s.title as supplier_title, c.item_cost, c.item_description, c.bought_date, c.percentage, c.payed_date, IF(c.payed_date IS NULL, 0, 1) is_payed, c.adate, c.edate" +
        " FROM commissions c" +
        " INNER JOIN suppliers s ON s.id = c.supplier_id" +
        " WHERE c.project_id=?" +
        " ORDER BY c.adate ASC", [project_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parseCommissionObject);
            results.forEach(buildCommissionObject);
            callback(results);
        });
    console.log("in getCommissionsInfoByProject. commission_id: " + project_id);
};


const getCommissionsInfoBySupplier = (supplier_id, callback) => {
    console.log("in getCommissionsInfoBySupplier. supplier_id: " + supplier_id);
    mysql.connection.query(
        "SELECT c.*, CONCAT(p.city,', ', p.address) as project_address, IF(c.payed_date IS NULL, 0, 1) is_payed" +
        " FROM commissions c" +
        " INNER JOIN projects p ON p.id=c.project_id" +
        " WHERE c.supplier_id=?" +
        " ORDER BY c.adate ASC", [supplier_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parseCommissionObject);
            results.forEach(buildCommissionObject);
            callback(results);
        });
};

const setNewCommission = (data, callback) => {
    const {sql, values} = lib.buildSqlCreate('commissions', [ 'project_id', 'supplier_id', 'item_cost', 'item_description', 'percentage', 'bought_date'], data);
    let succeed = false;
    mysql.connection.query(sql, values,
        function (err, results) {
            if (err) {console.log(err); throw err}
            console.log("created");
            succeed = true;
            // callback({'action': action, 'succeed': succeed});
        });
    callback({'action': 'CREATE', 'succeed': succeed});
};

const setPaymentCommission = (commission_id, data, callback) => {
    getCommissionInfo(commission_id, false,{},(commission_data) => {
        let data_payments = {
            object: 'COMMISSION',
            object_id: commission_id,
            rel_object: 'PROJECT',
            rel_object_id: commission_data.project_id,
            method: data.method,
            amount: (commission_data.percentage /100) * commission_data.item_cost,
        };
        const {sql, values} = lib.buildSqlCreate('payments', ['object', 'object_id', 'rel_object', 'rel_object_id', 'method', 'amount'], data_payments);
        mysql.connection.query(sql, values,
            function (err, results) {
                if (err) {throw err}
                let data_commission = {
                    payed_date: data.payed_date
                };
                const {sql, values} = lib.buildSqlUpdate('commissions', ['payed_date'], data_commission, commission_id);
                mysql.connection.query(sql, values,
                    function (err, results) {
                            callback({'action': 'CREATE'});
                        });
            });
    })
};

const setCommissionInfo = (commission_id, data, callback) => {
    console.log("in setCommissionInfo. commission_id: " + commission_id);
    let succeed = false;
    getCommissionInfo(commission_id, false,{},(old_data) => {
        const fields = Object.keys(data);
        if(old_data === undefined){
            const {sql, values} = lib.buildSqlCreate('commissions', [ 'project_id', 'supplier_id', 'item_cost', 'item_description', 'percentage', 'bought_date'], data);
            mysql.connection.query(sql, values,
                function (err, results) {
                    if (err) {console.log(err); throw err}
                    succeed = true;
                    // callback({'action': action, 'succeed': succeed});
                });
            callback({'action': 'CREATE', 'succeed': succeed});
        }
        else {
            let action = 'UPDATE';
            let fields_changed = [];
            fields.forEach(function (item, index) {
                if (lib.isValueChanged(old_data[item], data[item])) {
                    fields_changed.push(item);
                }
            });

            if (fields_changed.length > 0) {
                const {sql, values} = lib.buildSqlUpdate('commissions', fields_changed, data, commission_id);
                mysql.connection.query(sql, values,
                    function (err, results) {
                        if (err) throw err;
                        console.log("updated");
                        if (results.affectedRows > 0) {
                            succeed = true;
                        }
                        callback({action: action, succeed: succeed});
                    })
            } else {
                callback({action: action, succeed: succeed});
            }
        }
    });
};

const getCommissionsIds = (callback) => {
    console.log("in getCommissionsIds");
    mysql.connection.query(
        "SELECT c.id, CONCAT(s.title, ' -  ', c.item_description) as title" +
        " FROM commissions c" +
        " INNER JOIN suppliers s ON s.id=c.supplier_id",
        function (err, result, fields) {
            if (err) throw err;
            callback(result);
        });
};

function parseCommissionObject(item) {
    item.adate = base.parseDate(item.adate, false);
    item.edate = base.parseDate(item.edate, false);
    item.bought_date = base.parseDate(item.bought_date, false);
    item.payed_date = base.parseDate(item.payed_date, false);
    item.is_payed = item.is_payed ? 'Yes' : 'No';
}

function buildCommissionObject(item) {
    item.item = {cost: item.item_cost, description: item.item_description};
    console.log(item);
    item.amount = (item.item_cost * (item.percentage /100));
}

module.exports = {
    getCommissionInfo: getCommissionInfo,
    getCommissionsInfoByProject: getCommissionsInfoByProject,
    setNewCommission: setNewCommission,
    getCommissionsInfoBySupplier: getCommissionsInfoBySupplier,
    setCommissionInfo: setCommissionInfo,
    getCommissionsIds: getCommissionsIds,
    setPaymentCommission: setPaymentCommission
};