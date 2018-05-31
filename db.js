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

exports.query = function(query, values, callback) {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'paninerd_bot'
    });
    state.pool.query(query, values, callback);
};

exports.get = function() {
    return state.pool;
};