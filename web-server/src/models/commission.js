const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');

const getCommissionInfo = (commission_id, to_parse = false, queries, callback) => {
    console.log("in getCommissionInfo. project: " + commission_id);
    if(!commission_id){
        callback(queries);
    }else {
        mysql.connection.query(
            "SELECT id, project_id, supplier_id, payment_method, item_cost, item_description, percentage, adate, edate" +
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
    console.log("in getCommissionsInfoByProject. commission_id: " + project_id);
    mysql.connection.query(
        "SELECT *" +
        " FROM commissions" +
        " WHERE project_id=?" +
        " ORDER BY adate ASC", [project_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parseCommissionObject);
            results.forEach(buildCommissionObject);
            callback(results);
        });
};


const getCommissionsInfoBySupplier = (supplier_id, callback) => {
    console.log("in getCommissionsInfoBySupplier. supplier_id: " + supplier_id);
    mysql.connection.query(
        "SELECT c.*, p.address as project_address" +
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
    const {sql, values} = lib.buildSqlCreate('communications', [ 'project_id', 'supplier_id', 'item_cost', 'item_description', 'percentage', 'payment_method'], data);
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

const setCommissionInfo = (commission_id, data, callback) => {
    console.log("in setCommissionInfo. commission_id: " + commission_id);
    let succeed = false;
    getCommissionInfo(commission_id, false,{},(old_data) => {
        const fields = Object.keys(data);
        if(old_data === undefined){
            const {sql, values} = lib.buildSqlCreate('commissions', [ 'project_id', 'supplier_id', 'item_cost', 'item_description', 'percentage', 'payment_method'], data);
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

function parseCommissionObject(item) {
    item.adate = base.parseDate(item.adate, true);
    item.edate = base.parseDate(item.edate, true);
}

function buildCommissionObject(item) {
    item.item = {cost: item.item_cost, description:item.item_description};
    item.commission_value = (item.item_cost * (item.percentage /100));
}

module.exports = {
    getCommissionInfo: getCommissionInfo,
    getCommissionsInfoByProject: getCommissionsInfoByProject,
    setNewCommission: setNewCommission,
    getCommissionsInfoBySupplier: getCommissionsInfoBySupplier,
    setCommissionInfo: setCommissionInfo
};