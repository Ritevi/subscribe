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
        type:Sequelize.CHAR(64),
        validate: {
            isUnique: (hwid)=> {
                this.find({ where: { username: hwid }})
                    .then(function (user) {
                        if (user) {
                            throw new AuthError("hwid is not unique");
                        }
                    });
            }
        }
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

User.prototype.validPassword = function(password,cb) {
    bcrypt.compare(password, this.password,cb);
};
User.prototype.validhwid = function(hwid){
  return this.getData("hwid")  === hwid;
};

User.registration = function(username,password,email,hwid,cb) {
    this.findOne({where:{email,username}})
        .then( (user)=> {
            if(user) {
                cb(new AuthError('user already exist'),null);
            } else
            {
                if(password.length>=6 && password.length<=32) {
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
                                async.map(err.errors, (elem, callback) => {
                                    callback(null, elem.validatorName);
                                }, (err, result) => {
                                    if(err) return cb(err,null);
                                    if(result!= '') {
                                        cb(new AuthError('error in validation '+result.join(', ')), null);
                                    } else {
                                        cb(new AuthError('email or username are already taken '), null);
                                    }
                                });

                            })
                    })
                } else {
                    cb(new AuthError('No valid password'),null);
                }
            }
        })
        .catch(function (err) {
            return cb(err,null)
        })
};


User.authorizeWithHwid = function(username,password,hwid, cb) {
  this.findOne({where:{username}})
      .then(user=>{
          if(user){
              user.validPassword(password,(err,res)=>{
                  if(res) {
                      if(user.hwid){
                          if(user.validhwid(hwid)){
                              cb(null,user);
                          } else {
                              cb(new AuthError('hwid is wrong'),null);
                          }
                      } else {
                          user.hwid = hwid;
                          user.save()
                              .then((user)=>{
                                  if(user) {
                                      cb(null,user);
                                  } else {
                                      cb(null,null);
                                  }
                              })
                              .catch((err)=>{
                                  console.log(err);
                                  return cb(err,null);
                              })
                      }
                  }
                  else {
                      cb(new AuthError('error in valid password'),null);
                  }
              })

          } else {
              cb(new AuthError("user doesn't exist"),null);
          }
      })
      .catch(err=>{
          cb(err,null);
      })
};


User.authorize = function(username,password, cb) {
    this.findOne({where:{username}})
        .then(user=>{
            if(user){
                user.validPassword(password,(err,res)=>{
                    if(res) {
                        cb(null,user);
                    }
                    else {
                        cb(new AuthError('error in valid password'),null);
                    }
                })

            } else {
                cb(new AuthError("user doesn't exist"),null);
            }
        })
        .catch(err=>{
            cb(err,null);
        })
};

User.subscribe = function(email,cb){
  this.findOne({where:{email}})
      .then((user)=>{
          if(user){
              let tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              user.end_date = tomorrow;
              user.save()
                  .then((user)=>{
                      if(user) {
                          cb(null,user);
                      } else {
                          cb(null,null);
                      }
                  })
                  .catch((err)=>{
                      cb(err,null);
                  })
          } else {
              cb(new AuthError('no valid email'),null);
          }
      })
      .catch((err)=>{
          cb(err,null);
      })
};

User.checkSubscribe = function(email,cb){
  this.findOne({where:{email}})
      .then((user)=>{
          if(user){
              if(Date.parse(user.get('end_date'))<Date.now()) {
                  user.end_date = null;
                  user.save().catch((err)=>{
                      cb(err,null);
                  })
                      .then((user)=>{
                          if(user) {
                              cb(null,user);
                          } else {
                              cb(null,null);
                          }
                      })
              } else {
                  cb(null,user);
              }
          } else {
              cb(new AuthError('no valid email'),null);
          }
      })
      .catch((err)=>{
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