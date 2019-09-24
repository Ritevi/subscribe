var User = require('../models').User;

module.exports = function(req, res, next) {
    req.email = res.locals.email= null;
    req.end_date = res.locals.end_date = null;
    req.username = res.locals.username = null;

    if (!req.session.email) return next();
    User.findOne({where:{
            email:req.session.email
        }})
        .then(user=>{
            if(user){
                req.email = res.locals.email= user.get('email');
                req.end_date = res.locals.end_date = user.get('end_date');
                req.username = res.locals.username = user.get('username');
                next();
            } else {
                next();
            }

        })
        .catch(err=>{
            next(err);
        })


};

