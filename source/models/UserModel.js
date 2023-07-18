const connection = require('../utils/database.js');

class UserModel {
    getUserByMeta(meta) {
        return new Promise((resolve, reject) => {
            const projection = 'id, name, email, subscriber_count, avatar_path, meta, status';
            const sql = `SELECT ${projection} FROM user
                         WHERE meta = ? LIMIT 1`;

            connection.query(sql, [meta], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    getUsersByName(search_query) {
        search_query = `%${search_query}%`;
        return new Promise((resolve, reject) => {
            const projection = 'id, name, subscriber_count, avatar_path, meta';
            const sql = `SELECT ${projection} FROM user
                         WHERE name LIKE ? AND hide = 0 AND status = 0
                         ORDER BY \`order\`
                         LIMIT 3`;

            connection.query(sql, [search_query], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM user
                         WHERE email = ?`;

            connection.query(sql, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    addVideosHistory(user_id, video_id) {
        this.deleteVideoHistory(user_id, video_id);

        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO history (user_id, video_id) VALUES (?, ?)`;

            connection.query(sql, [user_id, video_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    deleteVideoHistory(user_id, video_id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM history WHERE user_id = ? AND video_id = ?`;

            connection.query(sql, [user_id, video_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    createAccountForUser(user) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO user(name, email, password, role_id) VALUES ?`;

            connection.query(sql, [
                [user]
            ], (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    };

    updateProfile(email, name, avatar, meta) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE user SET name = ?, avatar_path = ?, meta = ? WHERE email = ?`

            connection.query(sql, [name, avatar, meta, email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    changePassword(email, newpwd) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE user SET password = ? WHERE email = ?`

            connection.query(sql, [newpwd, email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };
}

module.exports = new UserModel;