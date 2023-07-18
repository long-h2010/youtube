const connection = require('../utils/database.js');

class PlaylistModel {
    getPlaylistById(id) {
        return new Promise((resolve, reject) => {
            const projection = 'user.id as user_id, user.name as user_name, user.meta, playlist.id, playlist.name, video_count, privacy';
            const sql = `SELECT ${projection} FROM \`playlist\`
                         INNER JOIN user ON playlist.user_id = user.id
                         WHERE playlist.id = ?
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

    getPlaylistsByUser(userId, getAll) {
        userId = parseInt(userId);
        getAll = getAll ? null : 0;
        return new Promise((resolve, reject) => {
            const projection = 'playlist.id, playlist.name, video_count, dateedit, playlistcontent.video_id, thumbnail';
            const sql = `SELECT ${projection} FROM \`playlist\`
                            LEFT JOIN playlistcontent ON playlist.id = playlistcontent.playlist_id
                            LEFT JOIN video ON playlistcontent.video_id = video.id
                            WHERE playlist.user_id = ? AND playlist.hide = 0 
                                  AND (playlist.privacy = ? OR ? IS NULL)
                            GROUP BY playlist.id
                            ORDER BY playlist.order`;

            connection.query(sql, [userId, getAll, getAll], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    getPlaylistsByUserId(userId, videoId) {
        userId = parseInt(userId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const projection = 'playlist.id, playlist.name, privacy, playlistcontent.video_id';
            const sql = `SELECT ${projection} FROM \`playlist\`
                            LEFT JOIN playlistcontent ON 
                            playlist.id = playlistcontent.playlist_id AND playlistcontent.video_id = ?
                            WHERE playlist.user_id = ?`;

            connection.query(sql, [videoId, userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    addPlaylist(userId, name, privacy) {
        userId = parseInt(userId);
        privacy = parseInt(privacy);
        return new Promise((resolve, reject) => {
            const insertFields = '`user_id`, `name`, `privacy`';
            const sql = `INSERT INTO \`playlist\` (${insertFields})
                            VALUES (?, ?, ?)`;

            connection.query(sql, [userId, name, privacy], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    };
}

module.exports = new PlaylistModel;