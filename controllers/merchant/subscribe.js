var freeKassa = require('../../models/freeKassa');
var config = require('../../config');


exports.get = function (req,res) {
    var kassa = new freeKassa(config.get('kassa'));
    let orderID = req.session.email;
    res.redirect(kassa.getForm(config.get("kassa:amount:subscribe"),orderID));
};