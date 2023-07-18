var express = require('express');
var router = express.Router();

var indexController = require('../controllers/IndexController.js');

const loginValidator = require('../middlewares/loginValidator.js');
const registerValidator = require('../middlewares/registerValidator.js');

// Login register page
router.get('/login', indexController.getLogin);
router.post('/login', loginValidator, indexController.login);
router.post('/register', registerValidator, indexController.register);
router.get('/logout', indexController.logout);

// Channel page
router.get('/channel/:meta', indexController.getChannel);

// Watch video, playlist page
router.get('/watch', indexController.watch);
router.get('/watch', indexController.getWatch);
router.get('/watch/comment', indexController.getWatchComment);

// Search page
router.get('/search', indexController.getSearch);

// Home page
router.get('/video/:id', indexController.getNextListVideo);
router.get('/:id', indexController.getNextIndex);
router.get('/', indexController.getIndex);

module.exports = router;