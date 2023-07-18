const connection = require('../../utils/database.js');
const { convertBuffer2Boolean } = require('../../utils/helper/helper.js')

class UserModel {
    getUsers() {
        return new Promise(function(resolve, reject) {
            let sql = ` SELECT USER.*,
                        SUM(VIDEO.VIEW_COUNT) AS TOTAL_VIEW_COUNT,
                        COUNT(VIDEO.ID) AS TOTAL_VIDEO
                        FROM USER LEFT JOIN VIDEO ON USER.ID = VIDEO.USER_ID
                        WHERE USER.ROLE_ID <> 1
                        GROUP BY USER.ID
                        `
            connection.query(sql, (err, users) => {
                if (err) {
                    reject(err)
                }

                // console.log("Số lượng user " + users.length)
                // console.log(JSON.stringify(users))

                users = users.map(user => ({
                    ...user,
                    _hide: convertBuffer2Boolean(user.hide)
                }))

                console.log(JSON.stringify(users))

                resolve(users)
            })
        })
    }

    getUsersById(id) {
        return new Promise(function(resolve, reject) {

            let sql = ` SELECT USER.*,
                        COUNT(*) AS NUM_VIDEO,
                        SUM(VIDEO.view_count) AS TOTAL_VIEW,
                        SUM(VIDEO.like_count) AS TOTAL_LIKE,
                        SUM(VIDEO.comment_count) AS TOTAL_COMMENT
                        FROM USER INNER JOIN VIDEO ON USER.id = VIDEO.USER_ID
                        WHERE USER.ID = ? and WHERE USER.ROLE_ID <> 1
                        `

            connection.query(sql, [id], function(err, user) {
                if (err) {
                    reject(err);
                }

                if (!user) {
                    resolve(undefined)
                }

                console.log(JSON.stringify(user))

                user = user[0]

                user.status = convertBuffer2Boolean(user.status)

                resolve(user)
            })
        })
    }

    blockUserById(id) {
        return new Promise(function(resolve, reject) {
            let sql = 'UPDATE USER SET HIDE = 1 WHERE ID = ?'

            connection.query(sql, [id], function(err, rows) {
                if (err) {
                    reject(err)
                }

                resolve(rows.changedRows)
            })
        })
    }

    unblockUserById(id) {
        return new Promise(function(resolve, reject) {
            let sql = 'UPDATE USER SET HIDE = 0 WHERE ID = ?'

            connection.query(sql, [id], function(err, rows) {
                if (err) {
                    reject(err)
                }

                resolve(rows.changedRows)
            })
        })
    }

    deleteUserById(id) {
        return new Promise(function(resolve, reject) {

        })
    }
}

module.exports = new UserModel