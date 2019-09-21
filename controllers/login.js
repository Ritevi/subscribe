var User = require('../models').User;
var AuthError = require('../models').AuthError;

exports.get = function(req,res){
    res.render('login');
};

exports.post = function (req,res,next) {
    if(!req.body) next(AuthError('no users data'));
    var password = req.body.password;
    var username = req.body.username;

    User.authorize(username,password,(err,data)=>{
        if(err) {
            err.status = 403;
            return next(err);
        }
        if(data) {
            req.session.user = data.getDataValue('username');
            res.send({});
        } else {
            let error = new err;
            error.status=401;
            error.message = 'no user';
            next(error);
        }

    })


};