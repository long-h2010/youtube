const connection = require('../utils/database.js');

class CommentModel {
    getCommentsByVideoId(videoId, page, limit) {
        videoId = parseInt(videoId);
        page = parseInt(page);
        limit = parseInt(limit);
        return new Promise((resolve, reject) => {
            const projection = 'user.meta, avatar_path, name, comment.datebegin, content';
            const sql = `SELECT ${projection} FROM \`comment\`
                       INNER JOIN user ON comment.user_id = user.id
                       WHERE video_id = ? AND comment.hide = 0
                       ORDER BY datebegin DESC, comment.order ASC
                       LIMIT ? OFFSET ?`;

            let offset = (page - 1) * limit;

            connection.query(sql, [videoId, limit, offset], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    addComment(userId, videoId, content) {
        userId = parseInt(userId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const insertFields = '`user_id`, `video_id`, `content`';
            const sql = `INSERT INTO \`comment\` (${insertFields})
                         VALUES (?, ?, ?)`;

            connection.query(sql, [userId, videoId, content], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

module.exports = new CommentModel;