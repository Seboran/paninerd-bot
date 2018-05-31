var mysql = require('mysql');

var state = {
    pool: null
};

exports.connect = function(callback) {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'paninerd_bot'
    });
    callback();
};

exports.get = function() {
    return state.pool;
};