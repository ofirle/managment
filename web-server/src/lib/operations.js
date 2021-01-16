function buildSqlUpdate(table, fields, data, id, id_field='id', set_edate = true){
    let values = [];
    if(set_edate){
        fields.push('edate');
        data.edate = Math.floor(Date.now() / 1000);
    }
    let sql = "UPDATE " + table + " SET ";
    fields.forEach(function (item){
        sql += (item + "=?, ");
        values.push(data[item]);
    });
    values.push(id);
    return {sql: sql.slice(0, -2) + " WHERE " + id_field + "=?", values: values};
}

function isValueChanged(old_value, new_value){
    return (old_value !== new_value);
}

function buildSqlCreate(table, fields, data){
    let values = [];
    fields.push('adate');
    data.adate = Math.floor(Date.now() / 1000);
    let sql_fields = "";
    let sql_values = "";
    fields.forEach(function (item){
        sql_fields += (item + ", ");
        sql_values += ("?, ");
        values.push(data[item]);
    });
    sql_fields = sql_fields.slice(0, -2);
    sql_values = sql_values.slice(0, -2);
    let sql = "INSERT INTO " + table + " (" + sql_fields + ") VALUES (" + sql_values +");" ;

    return {sql: sql, values: values};
}

module.exports = {
    buildSqlUpdate: buildSqlUpdate,
    buildSqlCreate: buildSqlCreate,
    isValueChanged: isValueChanged
};