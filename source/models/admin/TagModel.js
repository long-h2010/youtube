const connection = require('../../utils/database.js');

class TagModel {
    getTags() {
        return new Promise(function(resolve, reject) {
            let sql = 'SELECT * FROM TAG'

            connection.query(sql, function(err, tags) {
                if (err) {
                    reject(err)
                }

                let _tags = tags.map(tag => {
                    var bytes = tag.hide
                    let hide = bytes[0] === 0

                    return {...tag, _hide: hide }
                })

                resolve(_tags)
            })
        })
    }

    getTagById(id) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tag WHERE ID = ?"

            connection.query(sql, [id], function(err, tag) {
                if (err) {
                    reject(err)
                }

                if (!tag) {
                    resolve(undefined)
                }

                tag = tag[0]

                var bytes = tag.hide
                tag.hide = bytes[0] === 0

                resolve(tag)
            })
        })
    }

    addTags(tag) {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO TAG VALUES (?)';

            connection.query(sql, [tag], function(err, result) {
                if (err) {
                    reject(err)
                }

                if (result === 0) {
                    resolve(['danger', 'Thêm chuyên mục thất bại'])
                } else {
                    // req.flash('status', 'success')
                    // req.flash('message', 'Thêm chuyên mục thành công')
                    resolve(['success', 'Thêm chuyên mục thành công'])
                }


            })
        })
    }

    editTag(tag) {
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE tag SET ? WHERE id = ?'

            connection.query(sql, tag, function(err, rows) {
                if (err) {
                    reject(err)
                }

                if (rows === 0) {
                    // req.flash('status', 'danger')
                    // req.flash('message', 'Chỉnh sửa chuyên mục thất bại')
                    resolve(['danger', 'Chỉnh sửa chuyên mục thất bại'])
                } else {
                    // req.flash('status', 'success')
                    // req.flash('message', 'Chỉnh sửa chuyên mục thành công')
                    resolve(['success', 'Chỉnh sửa mục thành công'])
                }
            })
        })
    }

    deleteTag(id) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM TAG WHERE ID = ?"

            connection.query(sql, [id], function(err, result) {
                if (err) {
                    reject(err)
                }

                resolve();
            })
        })
    }
}

module.exports = new TagModel