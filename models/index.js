var Sequelize = require('sequelize');
var sequelize = require('../libs/sequelize');
const bcrypt = require("bcrypt");
var util = require('util');
var async = require('async');

class User extends Sequelize.Model {}

User.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    username:{
        type:Sequelize.STRING(16),
        unique:true,
        validate:{
            len:[3,16],
            is: ["^[A-Za-z0-9-_]+$",'i']
        }
    },
    password:{
        type:Sequelize.STRING(64),
        validate:{
            notEmpty:true
        }
    },
    email:{
        type:Sequelize.STRING(32),
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true,
            notEmpty:true
        }
    },
    hwid: {
        type:Sequelize.CHAR(64)
    },
    end_date:{
        type:Sequelize.DATE
    },
    createdAt: {
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'user',
    timestamps: false
});

User.generateHash = function(password,cb){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, cb);
    });
};

User.prototype.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

User.registration = function(username,password,email,hwid,cb) {
    this.findOne({where:{email,username}})
        .then( (user)=> {
            if(user) {
                cb(new AuthError('user already exist'),null);
            } else
            {
                this.generateHash(password,(err,hash)=> {
                    if (err) return cb(err,null);
                    User.create({username,password:hash,email,hwid})
                        .then(function (newUser) {
                        if(!newUser) {
                            return cb(null,null);
                        } else {
                            return cb(null,newUser)
                        }
                    })
                        .catch(function (err){
                                async.map(err.errors, (elem, cb) => {
                                    cb(null, elem.validatorName);
                                }, (err, result) => {
                                    if(err) return cb(err,null);
                                    cb(new AuthError('error in validation '+result.join(', ')), null);
                                });

                        })
                })

            }
        })
        .catch(function (err) {
            return cb(err,null)
        })
};


User.authorize = function(username,password, cb) {
  this.findOne({where:{username}})
      .then(user=>{
          if(user.validPassword(password)) {
              cb(null,user);
          }
          else {
              cb(new AuthError('error in valid username'),null);
          }
      })
      .catch(err=>{
          cb(err,null);
      })
};

User.sync();

exports.User = User;

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}


util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;