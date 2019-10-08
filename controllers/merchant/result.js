var User = require('../../models/index').User;
var freeKassa = require('../../models/freeKassa');
var config = require('../../config');

var sendError = function(status,message) {
    let error = new Error;
    error.status=status;
    error.message = message;
    return (error);
};

exports.post = function (req,res,next){
    var kassa = new freeKassa(config.get('kassa'));
    if(kassa.validIp(kassa.getClientIP(req)).length()!==0){// check this in pro
        let amount = req.body.AMOUNT;
        let email = req.body.P_EMAIL;
        let sign = req.body.SIGN;
        let merchantId = req.body.MERCHANT_ID;
        let orderId = req.body.MERCHANT_ORDER_ID;
        if(merchantId===kassa.merchantId || sign ===kassa.getPaymentSign(amount,orderId)) {
            if(amount===config.get("kassa:amount:subscribe")) {
                User.subscribe(email,(err,data)=>{
                    if(err) return next(err);
                    if(data){
                        res.render('account');
                    } else {
                        next(sendError(500,'no user'))
                    }
                })
            } else {
                next(sendError(402,'no amount'));
            }
        } else {
        	next(sendError(404,"no valid data"));
        }
    } else {
        next();
    }
};

