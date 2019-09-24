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
        let amount = req.query.AMOUNT;
        let email = req.query.P_EMAIL;
        let sign = req.query.SIGN;
        let merchantId = req.query.MERCHANT_ID;
        let orderId = req.query.MERCHANT_ORDER_ID;
        if(merchantId===kassa.merchantId || sign ===kassa.getPaymentSign(amount,orderId)) {
            if(amount==config.get("kassa:amount:subscribe")) {
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
        }
    } else {
        next();
    }
};


/*
User.subscription(email,function (err,data) {
        if(err) {
            err.status = 401;
            return next(err);
        }
        if(data){
            res.render('/account');
        } else {
            let error = new err;
            error.status=500;
            error.message = 'no email data';
            next(error);

        }
    });
 */