const path = require('path');
const fs = require('fs');
const connection = require('../../utils/database.js');

module.exports = {
    convertBuffer2Boolean: function(buffer) {
        return buffer[0] === 0
    },
    getNumberVideoCurr: function() {
        return new Promise(function(resolve, reject) {
            let sql = 'SELECT COUNT(*) as NUM_VIDEO FROM video'

            connection.query(sql, function(err, result) {
                if (err) {
                    reject(err)
                }

                resolve(result[0])
            })

        })
    }
}