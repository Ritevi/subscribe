var User = require('./models').User;
var config = require('./config');

User.authorize('email12312@gmail.com','12345678',function (err,data) {
    console.log(err,);
});
