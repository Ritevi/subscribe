var User = require('../models').User;
var AuthError = require('../models').AuthError;

var sendError = function(status,message) {
    let error = new Error;
    error.status=status;
    error.message = message;
    return (error);
};

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
        if (data) {
            req.session.email = data.get('email');
            req.session.end_date = data.get('end_date');
            req.session.username = data.get('username');
            console.log(data);
            res.send({});
        } else {
            next(sendError(401,'user already exist'))
        }

    })
    
};

exports.get = function (req,res,next) {
    res.render('register');
};