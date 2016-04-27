var User = require('../models/user');
var Room = require('../models/room');

module.exports = function (req, res, next) {
    //req.user = res.locals.user = null;
    //req.user.local.email = null;
    if (req.session && req.session.user) {
        User.findOne(req.session.user, function (err, user) {
            if (err)
                next(err);
            else {
                req.user = user;
                Room.find({}, function (err, room) {
                    if (err)
                        next(err);
                    if(room.players.some(user) > -1) {
                        req.room = room;
                        console.log(req.room);
                    }
                });
                next();
            }
        });
    }
    else {
        next();
    }
};
/*
 module.exports = function(req, res, next) {
 if (req.session && req.session.user) {
 User.findOne({ email: req.session.user.email }, function(err, user) {
 if (user) {
 req.user = user;
 delete req.user.password; // delete the password from the session
 req.session.user = user;  //refresh the session value
 res.locals.user = user;
 }
 // finishing processing the middleware and run the route
 next();
 });
 } else {
 next();
 }
 };
 */
