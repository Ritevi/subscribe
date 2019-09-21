

module.exports = function (req,res,next) {
    if (!req.session.user) {
        err.status = 401;
        err.message = "Вы не авторезированы";
        return next(err);
    }
    next();
};