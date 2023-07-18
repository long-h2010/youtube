const express = require('express')
const router = express.Router()

const homeController = require('../controllers/admin/HomeController.js')
const usersController = require('../controllers/admin/UserController.js')
const videosController = require('../controllers/admin/VideoController.js')
const tagsController = require('../controllers/admin/TagController.js')

const isAdmin = require('../middlewares/checkIsAdmin.js')

router.use(isAdmin)

router.get('/users/:id/detail', usersController.detail)
router.get('/users', usersController.index)
router.get('/users/:id/block', usersController.blockUser)
router.get('/users/:id/unblock', usersController.unblockUser)
    //router.get('/users/:id/edit', usersController.showEdit)
    //router.get('/users/:id/delete', usersController.delete)
    //router.post('/users/:id/update', usersController.update)

router.get('/videos', videosController.index)
router.get('/videos/unapproved', videosController.showUnapprovedVideo)
router.get('/videos/:id/detail', videosController.detail)
router.get('/videos/:id/approved', videosController.approvedVideo)
router.get('/videos/:id/block', videosController.blockVideo)
router.get('/videos/:id/unblock', videosController.unblockVideo)
router.get('/videos/:id/delete', videosController.deleteVideo)
router.get('/videos/:id/feature', videosController.featureVideo)
router.get('/videos/:id/unfeature', videosController.unfeatureVideo)

router.get('/tags', tagsController.index)
router.get('/tags/add', tagsController.add)
router.get('/tags/:id/edit', tagsController.edit)
router.get('/tags/:id/delete', tagsController.delete)
router.post('/tags/add', tagsController.saveAdd)
router.post('/tags/:id/edit', tagsController.saveEdit)

router.get('/setting', homeController.setting)
router.post('/setting', homeController.saveSetting)

router.get('/', homeController.home)

module.exports = router