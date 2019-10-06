var User = require('../models').User;
var AuthError = require('../models').AuthError;

var SendJsonResponse = function(res, status, data){
    res.status(status);
    res.json(data);
};


exports.post = function (req,res,next) {
    if(!req.body) return SendJsonResponse(res,404,{});
    var password = req.body.password;
    var username = req.body.username;
    var hwid = req.body.hwid;

    User.authorizeWithHwid(username,password,hwid,(err,data)=>{
        if(err) {
            if(err instanceof AuthError){
                if(err.message === "hwid is not unique")
                {
                     SendJsonResponse(res,402,{});
                }
                else if(err.message === "hwid is wrong")
                {
                     SendJsonResponse(res,403,{});
                } else {
                     SendJsonResponse(res,401,{});
                }
            } else {
                 SendJsonResponse(res,400,{message:"unknown error"});
            }
        } else {
            if(data) {
                User.checkSubscribe(data.get('email'),(err,data)=>{
                    if(err){
                        if( err instanceof AuthError){
                            SendJsonResponse(res,401,{message:"user not found"});
                        } else {
                            SendJsonResponse(res,400,{message:"unknown error"});
                        }
                    }
                    if(data) {
                        if(data.get('end_date')){
                            SendJsonResponse(res,200,{
                                username:data.get('username'),
                                end_date:data.get('end_date')
                            });
                        } else {
                            SendJsonResponse(res,404,{});
                        }
                    } else {
                        SendJsonResponse(res,401,{});
                    }
                })

            } else {
                SendJsonResponse(res,400,{});
            }
        }
    })


};