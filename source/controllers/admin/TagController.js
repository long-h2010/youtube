var slugify = require('slugify')
const tagModel = require('../../models/admin/TagModel.js')
const connection = require('../../utils/database.js')

class TagController {
    index(req, res) {
        tagModel.getTags()
            .then(tags => {
                res.render('admin/tags/index', {
                    layout: 'admin.hbs',
                    title: 'Manage Tags',
                    tags: tags,
                    status: req.flash('status'),
                    message: req.flash('message'),
                })
            })
            .catch(err => {
                throw err;
            })
    }

    add(req, res) {
        res.render('admin/tags/add', {
            layout: 'admin.hbs',
            title: 'Tag',
            status: req.flash('status'),
            message: req.flash('message'),
            statusMessage: req.flash('message-status'),
        })
    }

    saveAdd(req, res) {
        console.log('Data from post: ' + JSON.stringify(req.body))

        let hide = false
        let name = req.body.name
        let order = parseInt(req.body.order)
        let meta = slugify(name, {
            lower: true
        })

        if (req.body.hide) {
            hide = true
        }

        let data = [0, name, meta, hide, order]

        tagModel.addTags(data)
            .then(result => {
                //console.log('Added tags: ', result)
                req.flash('status', result[0])
                req.flash('message', result[1])
                res.redirect('/admin/tags')
            })
            .catch(err => {
                throw err
            });
    }

    edit(req, res) {
        let _id = req.params.id

        if (!_id) {
            req.flash('status', 'danger')
            req.flash('message', 'id chuyên mục không hợp lệ')
            return res.redirect('/admin/tags')
        }

        tagModel.getTagById(_id)
            .then(tag => {
                if (!tag) {
                    req.flash('status', 'danger')
                    req.flash('message', 'Tag không hợp lệ')
                    return res.redirect('/admin/tags')
                }

                res.render('admin/tags/edit', {
                    layout: 'admin.hbs',
                    title: 'Tag',
                    tag: tag,
                    message: req.flash('message'),
                    statusMessage: req.flash('message-status'),
                })
            })
            .catch(err => {
                throw err
            })
    }

    saveEdit(req, res) {
        let _id = parseInt(req.params.id)

        //console.log("Data from body", JSON.stringify(req.body))

        let hide = true
        let name = req.body.name
        let order = (req.body.order)
        let meta = slugify(name, {
            lower: true
        })

        if (req.body.hide === '') {
            hide = false
        }

        let data = [{
            name: name,
            meta: meta,
            hide: hide,
            order: order
        }, _id]

        tagModel.editTag(data)
            .then(result => {
                //console.log('Added tags: ', result)
                req.flash('status', result[0])
                req.flash('message', result[1])
                res.redirect('/admin/tags')
            })
            .catch(err => {
                throw err
            });
    }

    delete(req, res) {
        let _id = req.params.id

        tagModel.deleteTag(_id)
            .then(() => {
                req.flash('status', 'success')
                req.flash('message', 'Xóa chuyên mục thành công')
                res.redirect('/admin/tags')
            })
            .catch(err => {
                throw err
            })
    }
}

module.exports = new TagController