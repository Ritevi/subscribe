var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/auth');
var Users_alpha = require("../controllers/hwid");

//router.post('/auth',AuthController.post);

router.post('/auth',Users_alpha.post);


module.exports = router;