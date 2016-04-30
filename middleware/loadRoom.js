var User = require('../models/user');
var Room = require('../models/room');

//const request = require('request');
const EventEmitter = require('events').EventEmitter;
/*var body = new EventEmitter();*/

//var roomNew;

module.exports = function (req, res, next) {
    User.findOne(function (err, user) {
        if (err)
            next(err);
        Room.findOne({players: {$in: [user]}}, function(err,room){
            if(err)
                next(err);
            req.room = room;
            /*req.room = room;
            roomNew = req.room;*/
            console.log("room ",req.room.players)
        })
    });
    next();
};
//module.exports.roomNew = roomNew;