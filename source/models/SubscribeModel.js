const connection = require('../utils/database.js');

class SubscribeModel {
    getSubscribeState(userId, subscribeUserId) {
        return new Promise((resolve, reject) => {
            const projection = 'subscribe_state';
            const sql = `SELECT ${projection} FROM \`subscribe\`
                         WHERE user_id = ? AND subscribe_user_id = ?
                         LIMIT 1`;

            connection.query(sql, [userId, subscribeUserId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };

    getUserSubscriptions(id) {
        return new Promise((resolve, reject) => {
            const projection = 'name, email, subscriber_count, avatar_path, user.meta, user.status';
            const sql = `SELECT ${projection} FROM subscribe 
                         INNER JOIN user ON user.id = subscribe.subscribe_user_id
                         WHERE user_id = ? AND subscribe_state = 1`;

            connection.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    addSubscribe(userId, subscribeUserId) {
        return new Promise((resolve, reject) => {
            const insertFields = '`user_id`, `subscribe_user_id`';
            const sql = `INSERT INTO \`subscribe\` (${insertFields})
                         VALUES (?, ?)`;

            connection.query(sql, [parseInt(userId), parseInt(subscribeUserId)], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };

    updateSubscribe(userId, subscribeUserId, state) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE \`subscribe\`
                         SET subscribe_state = ?
                         WHERE user_id = ? AND subscribe_user_id = ?`;

            connection.query(sql, [state, userId, subscribeUserId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };
}

module.exports = new SubscribeModel;