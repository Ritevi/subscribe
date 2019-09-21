var express = require('express');
var router = express.Router();
var registerController = require('../controllers/register');
var loginController = require('../controllers/login');
var logoutController = require("../controllers/logout");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/account', function(req, res, next) {
  res.render('account',{ title: '' });
});

router.post('/register',registerController.post);
router.get('/register',registerController.get);

router.post('/login',loginController.post);
router.get('/login',loginController.get);

router.post('/logout',logoutController.post);

module.exports = router;
