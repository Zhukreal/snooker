const session = require('express-session');
var Room = require('../models/room');
var User = require('../models/user');
const async = require('async');
const _ = require('lodash');

module.exports = function (req, res, next) {

    async.waterfall([
        function (cb) {
            Room.findOne({name: 'Lobby'}, function (err, lobby) {
                if (err) {
                    next(err);
                } else {
                    lobby.players.push(req.user._id);
                    lobby.playerCount++;
                    lobby.save(function (err) {
                        if (err) {
                            next(err);
                        } else {
                            cb(null, null);
                        }
                    })
                }
            })
        },
        function (arg, cb) {
            User.findOne(req.user, function (err, user) {
                if (err) {
                    next(err);
                } else {
                    user.local.userState = "waiting";
                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        cb(null, user);
                    })
                }
            })
        },
        function (arg, cb) {
            Room.find({'roomState': "incomplete"}, function (err, incRoom) {
                if (err) {
                    throw err;
                } else {
                    cb(null, incRoom);
                }
            })
        },
        function (incRoom, cb) {
            /*User.find({'local.userState': "waiting"}, function (err, wUser) {
                if (err) {
                    next(err);
                } else {*/
            console.log('count of incomplete rooms',_.size(incRoom));
                    if(incRoom.length == 0){
                        var newRoom = new Room({
                            name: req.params.id
                        });
                        newRoom.players.push(req.user._id);
                        newRoom.roomState = "incomplete";
                        newRoom.save(function(err){
                            if(err){
                                throw err;
                            }
                        })
                    } else {
                        Object.getFirstElement(incRoom).players.push(req.user._id);
                        Object.getFirstElement(incRoom).roomState = "complete";
                        Object.getFirstElement(incRoom).save(function(err){
                            if(err){
                                throw err;
                            }
                        });
                        cb(null,req.user,Object.getFirstElement(incRoom).players[0]);
                    }
            /*    }
            })*/

        },
        function(firstPlayer,secondPlayer,cb){
            console.log("retUser",firstPlayer);
            firstPlayer.local.userState = "ready";
            firstPlayer.save(function(err){
                if(err){
                    throw err;
                }
            });
            User.findById(secondPlayer, function(err,user){
                if(err){
                    next(err);
                } else {
                    user.local.userState = "ready";
                    user.save(function(err){
                        if(err){
                            throw err;
                        }
                    });
                    cb(firstPlayer._id,secondPlayer);
                }
            })
        },
        function (firstPlayer, secondPlayer, cb) {
            Room.findOne({'name': "Lobby"}, function (err, lobby) {
                if (err) {
                    next(err);
                } else {
                    lobby.players.pop(firstPlayer);
                    lobby.players.pop(secondPlayer);
                    lobby.playerCount -= 2;
                    lobby.save(function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                    cb(null, null);
                }
            })
        }
    ]);


    Object.prototype.getFirstElement = function (arr) {
        for (var i in arr) {
            return arr[i];
            break;
        }
    }
    /*var findUserInLobby = function () {
     return new Promise(function (resolve, reject) {
     User.findOne({'local.userState':"waiting"},function(err,user){
     if(err){
     reject(err);
     } else if (!user){
     resolve(user);
     } else {
     resolve(user);
     }
     })
     })
     };

     findUserInLobby()
     .then(
     response => {
     if(response === null ){
     console.log('lol');
     findUserInLobby();
     }
     },
     error => console.log(error)
     );*/

    next();
};






















