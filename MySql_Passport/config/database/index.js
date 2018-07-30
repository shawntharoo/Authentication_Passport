var mysql = require('mysql');
const connectionData = {
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.SQLDATABASE
}
var db;

function connectDatabase() {
    if (!db) {
        return db = mysql.createConnection(connectionData);
    }
    return db;
}

module.exports = connectDatabase();
