var User_alpha = require("../models/hwid").User_alpha;

var SendJsonResponse = function(res, status, data){
    res.status(status);
    res.json(data);
};

exports.post = function (req,res,next) {
    if(!req.body) return SendJsonResponse(res,401,{status:401});
    var hwid = req.body.hwid;
    User_alpha.authorization(hwid,(err,user)=>{
        if(err) {
            console.log(err);
            SendJsonResponse(res,400,{status:400})
        } else {
            if(user){
                SendJsonResponse(res,200,{status: 200,user:user});
            } else {
                SendJsonResponse(res,400,{status:400})
            }
        }
    });

};