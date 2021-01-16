const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');

const getColorInfo = (color_id, to_parse = false, queries, callback) => {
    console.log("in getColorInfo. color_id: " + color_id);
    if(!color_id){
        callback(queries);
    }else {
        mysql.connection.query(
            "SELECT cp.*" +
            " FROM colors_projects cp" +
            " WHERE id=? LIMIT 1", [color_id],
            function (err, results) {
                if (err) throw err;
                let result = results[0];
                // if (to_parse) {
                //     parsePaymentObject(result);
                // }
                callback(result);
            }
        );
    }
};

const getColorsInfoByProject = (project_id, callback) => {
    console.log("in getColorsInfoByProject. project_id: " + project_id);
    mysql.connection.query(
        "SELECT *" +
        " FROM colors_projects" +
        " WHERE project_id=?" +
        " ORDER BY adate ASC", [project_id],
        function (err, results) {
            if (err) throw err;
            results.forEach(parseColor);
            console.log(results);
            callback(results);
        });
};

const setColorInfo = (color_id, data, callback) => {
    console.log("in setColorInfo. color_id: " + color_id);
    let succeed = false;
    getColorInfo(color_id, false,{},(old_data) => {
        const fields = Object.keys(data);
        if(old_data === undefined){
            const {sql, values} = lib.buildSqlCreate('colors_projects', [ 'project_id', 'manufacturer', 'code', 'description'], data);
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
                const {sql, values} = lib.buildSqlUpdate('colors_projects', fields_changed, data, color_id);
                mysql.connection.query(sql, values,
                    function (err, results) {
                        if (err) throw err;
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

const setNewColor = (data, callback) => {
    const {sql, values} = lib.buildSqlCreate('colors_projects', [ 'project_id', 'manufacturer', 'code', 'description'], data);
    let succeed = false;
    mysql.connection.query(sql, values,
        function (err, results) {
            if (err) {console.log(err); throw err}
            console.log("created");
            succeed = true;
        });
    callback({'action': 'CREATE', 'succeed': succeed});
};
function parseColor(item){

    item.adate = base.parseDate(item.adate, false);
    if(!item.edate){
        item.edate = '---';
    }else{
        item.edate = base.parseDate(item.edate, false);
    }
}


module.exports = {
    getColorInfo: getColorInfo,
    getColorsInfoByProject: getColorsInfoByProject,
    setColorInfo: setColorInfo,
    setNewColor: setNewColor
};