var Sequelize = require('sequelize');
var sequelize = require('../libs/sequelize');

class User_alpha extends Sequelize.Model {}

User_alpha.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    hwid: {
        type:Sequelize.CHAR(64),
        validate: {
            isUnique: (hwid)=> {
                User_alpha.findOne({ where: { hwid: hwid }})
                    .then(function (user) {
                        if (user) {
                            throw new Error("hwid is not unique");
                        }
                    });
            }
        }
    }
}, {
    sequelize,
    modelName: 'users_alpha',
    timestamps: false
});


User_alpha.authorization = function (hwid,cb) {
  this.findOne({where:{hwid}})
      .then((user)=>{
          if(user){
              cb(null,{type:"exist",hwid:user.hwid});
          } else {
              User_alpha.create({hwid})
                  .then(function (newUser) {
                      if(!newUser) {
                          return cb(null,null);
                      } else {
                          return cb(null,{type:"add",hwid:newUser.hwid});
                      }
                  })
                  .catch((err)=>{
                      cb(err,null);
                  })
          }

      })
      .catch((err)=>{
          cb(err,null);
      })
};
User_alpha.sync();
exports.User_alpha = User_alpha;