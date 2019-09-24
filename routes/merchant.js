var express = require('express');
var router = express.Router();
var subscribeController = require('../controllers/merchant/subscribe');

router.get('/subscribe',subscribeController.get);

module.exports = router;