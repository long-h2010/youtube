const connection = require('../utils/database.js');

class LikeModel {
    getLikeState(userId, videoId) {
        userId = parseInt(userId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const projection = 'like_state';
            const sql = `SELECT ${projection} FROM \`like\`
                         WHERE user_id = ? AND video_id = ?
                         LIMIT 1`;

            connection.query(sql, [userId, videoId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    addLike(userId, videoId) {
        userId = parseInt(userId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const insertFields = '`user_id`, `video_id`';
            const sql = `INSERT INTO \`like\` (${insertFields})
                         VALUES (?, ?)`;

            connection.query(sql, [userId, videoId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };

    updateLike(userId, videoId, state) {
        userId = parseInt(userId);
        videoId = parseInt(videoId);
        state = parseInt(state);
        return new Promise((resolve, reject) => {
            const sql = `UPDATE \`like\`
                         SET like_state = ?
                         WHERE user_id = ? AND video_id = ?`;

            connection.query(sql, [state, userId, videoId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

module.exports = new LikeModel;