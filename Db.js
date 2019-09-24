var User = require('./models').User;
var config = require('./config');

User.checkSubscribe('name1@gmail.com',function (err,data) {
   console.log(err,data);
});