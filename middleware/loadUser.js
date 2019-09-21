var User = require('../models').User;

module.exports = function(req, res, next) {
    req.user = res.locals.user = null;

    if (!req.session.user) return next();
    User.findOne({where:{
            username:req.session.user
        }})
        .then(user=>{
            if(user){
                req.user = res.locals.user = user.get('username');
                next();
            } else {
                next();
            }

        })
        .catch(err=>{
            next(err);
        })


};

