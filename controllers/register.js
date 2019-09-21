var User = require('../models').User;
var AuthError = require('../models').AuthError;

exports.post = function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var hwid = req.body.hwid||null;
    
    User.registration(username,password,email,hwid,function (err,data) {
        if(err) {
            err.status = 403;
            return next(err);
        }
        req.session.user = data.get('username');
        console.log(data);
        res.send({});
    })
    
};

exports.get = function (req,res,next) {
    res.render('register');
};