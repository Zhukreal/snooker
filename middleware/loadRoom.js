var User = require('../models/user');
var Room = require('../models/room');

module.exports = function(req,res,next){
    User.findOne(req.session.user,function(err,user){
        if(err)
            next(err);
        console.log("user:",this)
    });
    next();
}