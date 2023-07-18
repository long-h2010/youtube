const connection = require('../utils/database.js');

class PlaylistContentModel {
    getPlaylistContentsById(id) {
        return new Promise((resolve, reject) => {
            const projection = 'user.name, playlist_id, video_id, title, thumbnail, length';
            const sql = `SELECT ${projection} FROM \`playlistcontent\`
                         INNER JOIN video ON playlistcontent.video_id = video.id
                         INNER JOIN user ON video.user_id = user.id
                         WHERE playlistcontent.playlist_id = ? AND playlistcontent.hide = 0
                         ORDER BY playlistcontent.order`;

            connection.query(sql, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    addPlaylistContent(playlistId, videoId) {
        playlistId = parseInt(playlistId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const insertFields = '`playlist_id`, `video_id`';
            const sql = `INSERT INTO \`playlistcontent\` (${insertFields})
                            VALUES (?, ?)`;

            connection.query(sql, [playlistId, videoId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    };
    
    deletePlaylistContent(playlistId, videoId) {
        playlistId = parseInt(playlistId);
        videoId = parseInt(videoId);
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM \`playlistcontent\`
                         WHERE playlist_id = ? AND video_id = ?`;

            connection.query(sql, [playlistId, videoId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new PlaylistContentModel;