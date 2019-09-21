var config = require('../config');
var Sequelize = require('sequelize');
const seqParams= config.get('sequelize');

var sequelize = new Sequelize(seqParams.database, seqParams.user, seqParams.password, {
    host: seqParams.host,
    dialect:seqParams.dialect
});

module.exports = sequelize;