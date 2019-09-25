var User = require('../models').User;
var AuthError = require('../models').AuthError;

var sendError = function(status,message) {
    let error = new Error;
    error.status=status;
    error.message = message;
    return (error);
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
            User.checkSubscribe(data.get('email'),(err,data)=>{
                if(err){
                    err.status = 404;
                    return next(err);
                }
                if(data) {
                    req.session.email = data.get('email');
                    req.session.end_date = data.get('end_date');
                    req.session.username = data.get('username');
                    res.send({});
                } else {
                    next(sendError(401,'error in valid email'))
                }
            })

        } else {
            let error = new Error();
            error.status=401;
            error.message = 'no user';
            next(error);
        }

    })


};