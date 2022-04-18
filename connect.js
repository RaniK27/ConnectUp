const mysql = require("mysql2");


module.exports = mysql.createConnection({ // create pool?
        connectionLimit : 10,
        host: "localhost",
        user: "root",
        password: "Draco1234",
        database: "connectup",
        multipleStatements: true
    });

