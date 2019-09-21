

module.exports = function (session) {
    var sequelize = require('./sequelize');
    var SequelizeStore = require('connect-session-sequelize')(session.Store);
    return new SequelizeStore({
        db: sequelize,
        expiration: 48 * 60 * 60 * 1000
    });
};
