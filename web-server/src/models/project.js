const mysql = require('../../db/connection');
const payments_model = require('./payment');
const images_model = require('./image');
const commissions_model = require('./commission');
const colors_model = require('./color');
const lib = require('../lib/operations');
const base = require('./base');


const getProjectsInfo = (filters, callback) => {
    console.log("in getProjectsInfo Info");
    const [where, values] = getFormatQuery(filters);
    mysql.connection.query(
        "SELECT pr.*, SUM(p.amount) as payment_payed" +
        " FROM projects pr " +
        " LEFT JOIN payments p ON p.object='PROJECT' AND p.object_id=pr.id " + where +
        " GROUP BY pr.id", values,
        function (err, result, fields) {
            if (err) throw err;
            result.forEach(payments_model.paymentObject);
            result.forEach(parseProjectInfo);
            callback(result);
        });
};

function getFormatQuery(filters){
    let where = 'WHERE 1';
    let values = [];
    if(filters !== false) {
        filters.forEach(function (filter) {
            switch (filter.object) {
                case 'COMPANY':
                    where += ' AND pr.company=?';
                    values.push(filter.value);
                    break;
                case 'STATUS':
                    where += ' AND pr.status=?';
                    values.push(filter.value);
            }
        });
    }
    return [where, values];
}

const getProjectsIds = (callback) => {
    console.log("in getProjectsIds");
    mysql.connection.query(
        "SELECT p.id, CONCAT(p.address, ', ', p.city) as title" +
        " FROM projects p",
        function (err, result, fields) {
            if (err) throw err;
            callback(result);
        });
};
const getProjectsNotFullyPayed = (callback) => {
    mysql.connection.query(
        "SELECT pr.*, IF(SUM(p.amount) IS NULL,0,SUM(p.amount)) as payment_payed" +
        " FROM projects pr" +
        " LEFT JOIN payments p ON p.object_id=pr.id AND p.object='PROJECT" +
        " GROUP BY pr.id" +
        " HAVING payment_payed<pr.payment_amount",
        function (err, results, fields) {
            if (err) throw err;
            results.forEach(payments_model.paymentRestToPay);
            let summery = 0;
            results.forEach(function(item){
                summery += item.rest_to_pay;
            });
            callback({"data":results, "summery": summery});
        });
};

const getProjectFull = (project_id, callback) => {
    console.log("in getProjectFull Info. project_id: " + project_id);
    getProjectInfo(project_id, true,(data) => {
        const result = {"info": data};
        payments_model.getPaymentsInfoByProject(project_id, (data) => {
            result.payments = data;
            getNotesInfo(project_id, (data) => {
                result.notes = data;
                images_model.getImages(project_id,(data) => {
                    result.images = data;
                    commissions_model.getCommissionsInfoByProject(project_id,(data) => {
                        result.commissions = data;
                        colors_model.getColorsInfoByProject(project_id, (data) => {
                            result.colors = data;
                            callback(result);
                        });
                    });
                });
            });
        });
    });
};

const getProjectInfo = (project_id, to_parse = false, callback) => {
    if(project_id === undefined){
        callback(null)
    }else {
        console.log("in getProjectInfo. project_id: " + project_id);
        mysql.connection.query(
            "SELECT pr.*, SUM(p.amount) as payment_payed" +
            " FROM projects pr" +
            " LEFT JOIN payments p ON p.object='PROJECT' AND p.object_id=pr.id" +
            " WHERE pr.id=?", [project_id],
            function (err, results) {
                if (err) throw err;
                let result = results[0];
                if (to_parse) {
                    result = parseProjectInfo(result);
                    payments_model.paymentObject(result);
                }
                callback(result);
            });
    }
};

const getSharedCompanies = (callback) => {
    let arrayObject = [];
    base.paymentSharedByCompany.forEach(function (item){
       arrayObject.push({key: Object.keys(item)[0], title: base.companiesArray[Object.keys(item)[0]], share: 50});
    });
    callback(arrayObject);
};

const setProjectInfo = (project_id, data, callback) => {
    console.log("in setProjectInfo. project_id: " + project_id);
    let updated = false;
    console.log(data);
    getProjectInfo(project_id, false,(old_data) => {
        if(old_data == null){
            callback({updated: false, data: 'PROJECT_NOT_FOUND'});
            return;
        }
        const fields = ['first_name', 'last_name', 'phone', 'city', 'address', 'status', 'company', 'start_date', 'payment_amount'];
        let fields_changed = [];
        fields.forEach(function (item, index) {
            if(lib.isValueChanged(old_data[item], data[item])){
                fields_changed.push(item);
            }
        });

        if(fields_changed.length > 0){
            const {sql, values} = lib.buildSqlUpdate('projects', fields_changed, data, project_id);
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

const addProject = (data, callback) => {
    const fields = ['first_name', 'last_name', 'city', 'address', 'status', 'payment_amount'];
    const {sql, values} = lib.buildSqlCreate('projects', fields, data);
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

const getNotesInfo = (project_id, callback) => {
    console.log("in getNotesInfo. prsoject_id: " + project_id);
    mysql.connection.query(
        "SELECT id, note, adate, edate" +
        " FROM notes" +
        " WHERE object=? AND object_id=?" +
        " ORDER BY adate ASC", ['PROJECT', project_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parseNotesObject);
            callback(results);
        });

};

function parseProjectInfo(item) {
    item.adate = base.parseDate(item.adate, false);
    item.start_date = base.parseDate(item.start_date, false);
    item.status = base.parseLabelText(item.status, base.projectsStatusArray);
    item.company = base.parseLabelText(item.company, base.companiesArray);
    return item;
}

function parseNotesObject(item) {
    item.adate = base.parseDate(item.adate, true);
    item.edate = base.parseDate(item.edate, true);
}

module.exports = {
    getProjectsInfo: getProjectsInfo,
    getProjectFull: getProjectFull,
    getProjectInfo: getProjectInfo,
    setProjectInfo: setProjectInfo,
    addProject: addProject,
    getProjectsIds: getProjectsIds,
    getProjectsNotFullyPayed: getProjectsNotFullyPayed,
    getSharedCompanies: getSharedCompanies
};