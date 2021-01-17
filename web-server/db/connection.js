const mysql = require('mysql');
const config = require('config');

const pool = mysql.createPool({
    host: config.get('db_stage.host'),
    user: config.get('db_stage.username'),
    password: config.get('db_stage.password'),
    database : config.get('db_stage.database'),
    typeCast: function (field, next) {
        if (field.type == 'VAR_STRING') {
            return field.string();
        }
        return next();
    }
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

// module.exports. = getConnection;
exports.connection = pool;
