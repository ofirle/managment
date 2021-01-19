const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');

// const getPayments = (from_time = false, to_time = false, calculate_own = false, callback) => {
const getPayments = (filters, calculate_own = false, callback) => {

    const [where, values] = getFormatQuery(filters);
    mysql.connection.query(
        "SELECT p.*, pr.city, pr.address, pr.company, s.title as supplier_title, pr2.company as company2" +
        " FROM payments p" +
        " LEFT JOIN projects pr ON p.object_id=pr.id AND object='PROJECT'" +
        " LEFT JOIN projects pr2 ON p.rel_object_id=pr2.id AND p.rel_object='PROJECT'" +
        " LEFT JOIN commissions c ON p.object_id=c.id AND object='COMMISSION'" +
        " LEFT JOIN suppliers s ON s.id=c.supplier_id" +
        where +
        " ORDER BY p.adate ASC", values,
        function (err, results, fields) {
            if (err) throw err;
            results.forEach(parsePayments);
            let summery = 0;
            results.forEach(function(item){
                summery += item.amount;
            });
            callback({"data": results, "summery": summery});
        });
};

function parsePayments(item){
    if(!item.company){
        item.company = item.company2;
    }
    let value = base.getValueCompanyShared(item.company, base.paymentSharedByCompany);
    console.log(value);
    if(value !== false){
        item.amount = item.amount * (value / 100);
    }
    item.adate = base.parseDate(item.adate);
    item.company = base.parseLabelText(item.company, base.companiesArray);
    item.object_value_text = item.object === 'PROJECT' ? item.city +', ' + item.address : item.supplier_title;
    item.object = base.parseLabelText(item.object, base.objectTypeArray);
}
const setNewPayment = (data, callback) => {
    const {sql, values} = lib.buildSqlCreate('payments', [ 'project_id', 'method', 'amount'], data);

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

const setPaymentInfo = (payment_id, data, callback) => {
    console.log("in setPaymentInfo. payment_id: " + payment_id);
    let succeed = false;
    getPaymentInfo(payment_id, false,(old_data) => {
        console.log("in setPaymentInfo, calling getPaymentInfo. payment_id: " + payment_id);
        const fields = Object.keys(data);
        if(old_data === undefined){
            const {sql, values} = lib.buildSqlCreate('payments', [ 'project_id', 'method', 'amount'], data);
            console.log('Create');
            mysql.connection.query(sql, values,
                function (err, results) {
                    if (err) {console.log(err); throw err}
                    console.log("created");
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
                const {sql, values} = lib.buildSqlUpdate('payments', fields_changed, data, payment_id);
                console.log('Update');
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

const getPaymentsInfoByProject = (project_id, callback) => {
    console.log("in getPaymentsInfoByProject. project_id: " + project_id);
    mysql.connection.query(
        "SELECT id, method, amount, adate, edate" +
        " FROM payments" +
        " WHERE object='PROJECT' AND object_id=?" +
        " ORDER BY adate ASC", [project_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parsePaymentObject);
            callback(results);
        });
};

const getPaymentInfo = (payment_id, to_parse = false, queries, callback) => {
    console.log("in getPaymentInfo. project: " + payment_id);
    if(!payment_id){
        callback(queries);
    }else {
        mysql.connection.query(
            "SELECT id, project_id, method, amount, adate, edate" +
            " FROM payments" +
            " WHERE id=? LIMIT 1", [payment_id],
            function (err, results) {
                if (err) throw err;
                let result = results[0];
                if (to_parse) {
                    parsePaymentObject(result);
                }
                callback(result);
            }
        );
    }
};

function parsePaymentObject(item) {
    item.method = base.parseLabelText(item.method, base.methodArray);
    item.adate = base.parseDate(item.adate, true);
    item.edate = base.parseDate(item.edate, true);
}

function paymentObject(item) {
    item.payment = {
        payed: item.payment_payed,
        total: item.payment_amount,
        process_percentage: ((item.payment_payed / item.payment_amount) * 100).toFixed(2)
    };
    delete (item.payment_payed);
}

function paymentRestToPay(item) {
    if(base.isKeyExist(item.company, base.paymentSharedByCompany)){
        item.payment_amount = item.payment_amount * (paymentSharedByCompany[item.company] / 100);
        item.payment_payed = item.payment_payed * (paymentSharedByCompany[item.company] / 100);
    }
    item.company = base.parseLabelText(item.company, base.companiesArray);
    item.rest_to_pay = item.payment_amount - item.payment_payed;
}

function getFormatQuery(filters){
    let where = ' WHERE 1';
    let values = [];
    if(filters !== false) {
        filters.forEach(function (filter) {
            switch (filter.object) {
                case 'FROM_DATE':
                    where += ' AND p.adate>=?';
                    values.push(filter.value);
                    break;
                case 'TO_DATE':
                    where += ' AND p.adate<=?';
                    values.push(filter.value);
                    break;
                case 'COMPANY':
                    where += ' AND pr.company=?';
                    values.push(filter.value);
                    break;
                case 'OBJECT':
                    where += ' AND p.object=?';
                    values.push(filter.value);
                    break;

            }
        });
    }
    return [where, values];
}


module.exports = {
    getPaymentsInfoByProject: getPaymentsInfoByProject,
    getPaymentInfo: getPaymentInfo,
    setPaymentInfo: setPaymentInfo,
    paymentObject: paymentObject,
    getPayments: getPayments,
    paymentRestToPay: paymentRestToPay,
    setNewPayment: setNewPayment,
};