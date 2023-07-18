const connection = require('../../utils/database.js')
const userModel = require('../../models/admin/UserModel.js')

class UserController {
    index(req, res) {
        userModel.getUsers()
            .then((users) => {
                res.render('admin/users/index', {
                    layout: 'admin.hbs',
                    title: 'Manage Users',
                    users: users,
                    message: req.flash('message'),
                })
            })
            .catch((err) => {
                throw err
            })
    }

    blockUser(req, res) {
        let _idUser = req.params.id

        userModel.blockUserById(_idUser)
            .then(numRows => {
                if (numRows === 1) {
                    req.flash('status', 'success')
                    req.flash('message', 'Đã block người dùng')
                } else {
                    req.flash('status', 'danger')
                    req.flash('message', 'Không thể block người dùng')
                }

                res.redirect('/admin/users')
            })
            .catch((err) => {
                throw err
            })
    }

    unblockUser(req, res) {
        let _idUser = req.params.id

        userModel.unblockUserById(_idUser)
            .then(numRows => {
                if (numRows === 1) {
                    req.flash('status', 'success')
                    req.flash('message', 'Đã unblock người dùng')
                } else {
                    req.flash('status', 'danger')
                    req.flash('message', 'Không thể unblock người dùng')
                }

                res.redirect('/admin/users')
            })
            .catch((err) => {
                throw err
            })
    }

    detail(req, res) {
        let _userId = req.params.id

        // console.log("User id is: " + _userId)

        if (!_userId) {
            req.flash('message', 'User not found')
            response.redirect('/admin/users')
        }

        userModel.getUsersById(_userId)
            .then(user => {
                if (!user) {
                    req.flash('message', 'User not found')
                    return response.redirect('/admin/users')
                }

                res.render('admin/users/detail', {
                    layout: 'admin.hbs',
                    title: 'Manage Users',
                    user: user,
                })
            })
            .catch((err) => {
                throw err
            })
    }

    // showEdit(req, res) {
    //     let _userId = req.params.id

    //     console.log('User id edit', _userId)

    //     if (!_userId) {
    //         req.flash('message', 'Id user not correct')
    //         response.redirect('/admin/users')
    //     }

    //     let sql = 'SELECT * FROM USER WHERE ID = ?'

    //     connection.query(sql, [_userId], function(err, user) {
    //         if (err) {
    //             throw err
    //         }

    //         if (!user) {
    //             req.flash('message', 'User not found')
    //             return response.redirect('/admin/users')
    //         }

    //         user = user[0]

    //         var hide_buffer = Buffer.from(user.hide)
    //         var hide_boolean = Boolean(hide_buffer.readInt8)
    //         user.hide = hide_boolean

    //         var status_buffer = Buffer.from(user.status)
    //         var status_boolean = Boolean(status_buffer.readInt8)
    //         user.status = status_boolean

    //         console.log(user)

    //         res.render('admin/users/edit', {
    //             layout: 'admin.hbs',
    //             title: 'Manage Users',
    //             user: user
    //         })
    //     })
    // }

    // update(req, res) {
    //     let _userId = req.params.id

    //     console.log("Id update:", _userId)
    //     console.log("Data update: ", JSON.stringify(req.body))

    //     let sql = "SELECT * FROM USER WHERE ID = ?"

    //     connection.query(sql, [_userId], function(err, users) {
    //         if (err) {
    //             throw err
    //         }

    //         if (!users) {
    //             req.flash('message', 'User not found')
    //             return response.redirect('/admin/users')
    //         }
    //     })

    //     res.redirect('/admin/users')
    // }

    // delete(req, res) {
    //     let _id = req.params.id

    //     console.log("Id user delete: " + _id)

    //     let sql = "DELETE FROM USER WHERE ID = ?;"

    //     connection.query(sql, [_id, _id], function(err, result) {
    //         if (err) {
    //             throw err
    //         }

    //         req.flash('message', 'Delete user successfully')
    //         console.log("Delete user successfully")
    //         res.redirect('/admin/users');
    //     })
    // }
}

module.exports = new UserController;