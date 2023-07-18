const mysql = require('mysql')
const credentials = require('./credentials.js')

var connection = mysql.createConnection({
    host: credentials.database.mysql.host,
    user: credentials.database.mysql.user,
    password: credentials.database.mysql.password,
    database: credentials.database.mysql.database,
    multipleStatements: true,
})

connection.connect(err => {
    if (err) {
        throw err
    }

    console.log('Connection to database successful');
})

module.exports = connection