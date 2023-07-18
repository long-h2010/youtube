const connection = require('../utils/database.js');

class VideoModel {
    getVideoById(id) {
        return new Promise((resolve, reject) => {
            const projection = 'id as video_id, title, description, privacy, tag_id, length, thumbnail, path';
            const sql = `SELECT ${projection} FROM video WHERE id = ?`;

            connection.query(sql, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    };

    getTag() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tag`;

            connection.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    updateVideo(id, thumbnail, title, privacy, description, tag) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE video SET thumbnail = ?, title = ?, privacy = ?, description = ?, tag_id = ? WHERE id = ?`;

            connection.query(sql, [thumbnail, title, parseInt(privacy), description, tag, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    };

    getFeatureVideos(tagMeta) {
        return new Promise((resolve, reject) => {
            const projection = 'user.name, avatar_path, user.meta, user.status, video.id, title, description, like_count, view_count, comment_count, privacy, length, thumbnail, path, video.datebegin, video.status';
            const sql = `SELECT ${projection} FROM \`video\`
                       INNER JOIN user ON video.user_id = user.id
                       INNER JOIN tag ON video.tag_id = tag.id
                       WHERE feature = 1 AND privacy = 0 AND video.hide = 0 AND (tag.meta = ? OR ? IS NULL)
                       ORDER BY video.order`;

            connection.query(sql, [tagMeta, tagMeta], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    getFeatureVideosByTitle(search_query) {
        search_query = `%${search_query}%`;
        return new Promise((resolve, reject) => {
            const projection = 'user.name, avatar_path, user.meta, user.status, video.id, title, description, like_count, view_count, comment_count, privacy, length, thumbnail, path, video.datebegin, video.status';
            const sql = `SELECT ${projection} FROM \`video\`
                       INNER JOIN user ON video.user_id = user.id
                       INNER JOIN tag ON video.tag_id = tag.id
                       WHERE title LIKE ? AND feature = 1 AND privacy = 0 AND video.hide = 0
                       ORDER BY video.order`;

            connection.query(sql, [search_query], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    getVideosOrderByTag(videoId, tagMeta) {
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const projection = 'user.name, avatar_path, user.meta, user.status, video.id, title, description, like_count, view_count, comment_count, privacy, length, thumbnail, path, video.datebegin, video.status';
            const sql = `SELECT ${projection} FROM \`video\`
                         INNER JOIN user ON video.user_id = user.id
                         INNER JOIN tag ON video.tag_id = tag.id
                         WHERE video.id != ? AND privacy = 0 AND video.hide = 0
                         ORDER BY 
                             CASE WHEN tag.meta = ? THEN 0 ELSE 1 END,
                             video.order`;

            connection.query(sql, [videoId, tagMeta], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    getVideo(id) {
        return new Promise((resolve, reject) => {
            const projection = 'user_id, user.name, avatar_path, user.meta, user.status, tag.name as tag_name, tag.meta as tag_meta, video.id, title, description, subscriber_count, like_count, view_count, comment_count, privacy, length, thumbnail, path, video.hide, video.datebegin, video.status';
            const sql = `SELECT ${projection} FROM \`video\`
                         INNER JOIN user ON video.user_id = user.id
                         INNER JOIN tag ON video.tag_id = tag.id
                         WHERE video.id = ?
                         LIMIT 1`;

            connection.query(sql, [id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };

    getVideoByUser(id, getAll) {
        getAll = getAll ? null : 0;
        return new Promise((resolve, reject) => {
            const projection = 'id, title, length, thumbnail, view_count, datebegin';
            const sql = `SELECT ${projection} FROM video
                         WHERE user_id = ? AND ((privacy = ? AND status = ?) OR ? IS NULL)
                         ORDER BY \`order\``;

            connection.query(sql, [id, getAll, getAll, getAll], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    increaseVideoViewCountById(id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE \`video\`
                         SET view_count = view_count + 1
                         WHERE id = ?`;

            connection.query(sql, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    loadVideo(id) {
        const page = (id - 1) * 9 // 9: số lượng video mỗi lần phân trang
        return new Promise((resolve, reject) => {
            const projection = 'user.name, avatar_path, user.meta, user.status, video.id as video_id, title, view_count, privacy, length, thumbnail, path, video.datebegin, video.status';
            const sql = `SELECT ${projection} FROM \`video\`
                         INNER JOIN user ON video.user_id = user.id
                         WHERE feature = 1 AND video.hide = 0 AND video.privacy = 0 AND video.status = 0
                         LIMIT ?, 9`;

            connection.query(sql, [page], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    getVideosHistoryByUser(id) {
        return new Promise((resolve, reject) => {
            const projection = 'name, avatar_path, video.id as video_id, title, description, view_count, length, thumbnail, path, video.datebegin';
            const sql = `SELECT ${projection} FROM user 
                         INNER JOIN video ON user.id = video.user_id
                         INNER JOIN history ON video.id = history.video_id
                         WHERE history.user_id = ?
                         ORDER BY history.datebegin DESC`;

            connection.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    getVideosLikedByUser(id) {
        return new Promise((resolve, reject) => {
            const projection = 'name, avatar_path, video.id as video_id, title, description, view_count, length, thumbnail, path, video.datebegin';
            const sql = `SELECT ${projection} FROM user 
                         INNER JOIN video ON user.id = video.user_id
                         INNER JOIN \`like\` ON video.id = \`like\`.video_id
                         WHERE \`like\`.user_id = ? and like_state = 1
                         ORDER BY \`like\`.datebegin DESC`;

            connection.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    addVideo(userId, tagId, title, description, lengthVideo, thumbnail, path, meta, privacy) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO VIDEO (user_id, tag_id, title, description, length, thumbnail, path, meta, privacy) VALUES (?)`

            connection.query(sql, [
                [parseInt(userId), parseInt(tagId), title, description, lengthVideo, thumbnail, path, meta.toString(), parseInt(privacy)]
            ], (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows)
            })
        })
    }
}

module.exports = new VideoModel;