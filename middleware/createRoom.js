const session = require('express-session');
var Room = require('../models/room');
var User = require('../models/user');
const async = require('async');

/*module.exports = function (req, res, next) {

 async.parallel([
 function (cb) {
 Room.findOne({
 name: req.params.id,
 roomState: "waiting"
 }, function (err, room) {
 if (err) {
 next(err);
 }
 if (room) {
 room.players.push(req.user._id);
 room.playerCount++;
 room.ready();
 room.save(function (err) {
 if (err)
 throw err;
 cb(room);
 });

 } else {
 var newRoom = new Room({
 name: req.params.id,
 maxPlayers: 2
 });
 newRoom.players.push(req.user._id);
 newRoom.playerCount++;
 newRoom.wait();
 newRoom.save(function (err) {
 if (err)
 throw err;
 cb(newRoom);
 console.log("room has been created successfully");
 });
 }
 /!**!/
 })
 },
 function (cb) {
 /!*Room.count({roomState: "waiting"}, function (err, cnt) {
 if (err)
 next(err);
 _cb({"count": cnt});
 console.log("count ", cnt);
 });*!/
 Room.findOne({roomState: "waiting"}, function (err, room) {
 if (err) {
 next(err);
 } else {
 console.log("Waiting rooms ", room);
 cb(room);
 }
 })
 }
 ], function (result) {
 console.log("result", result);
 });


 next();
 };*/

module.exports = function (req, res, next) {
    async.parallel([
        function (cb) {
            Room.findOne({name: "Lobby"}, function (err, room) {
                if (err) {
                    next(err);
                } else {
                    room.players.push(req.user._id);
                    room.playerCount++;
                    room.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        cb(room);
                    })
                }
            });
        },
        function (_cb) {
            User.findById(req.user._id, function (err, user) {
                if (err) {
                    next(err);
                } else {
                    user.local.userState = "waiting";
                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        _cb(user);
                    })
                }
            })
        }
    ]);

    async.waterfall([
        function (cb) {
            User.findOne({'local.userState': "waiting"}, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    console.log('waiting users :', user);
                    var newRoom = new Room({
                        name: req.params.id
                    });
                    const _ = require('lodash');
                    console.log('user length', _.size(user));
                    if (user.length == 1) {
                        newRoom.players.push(req.user._id);
                        cb(null, null);
                        newRoom.save(function (err) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('Room with single user has been created');
                            }
                        })
                    } else {
                        newRoom.players.push(req.user._id);
                        console.log("first user : ", Object.getFirstElement(user));
                        newRoom.players.push(Object.getFirstElement(user).scope.local.nickname);
                        cb(null, Object.getFirstElement(user).scope.local.nickname);
                        console.log('callback return :', cb(null, Object.getFirstElement(user).scope.local.nickname));
                        //console.log("first elem",Object.getFirstElement(user).scope.local.nickname);
                        newRoom.save(function (err) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('Room has been created successfully');
                            }

                        })
                    }
                } else if (!user) {
                    console.log('no users founded');
                }
            });
        },
        function (firstUser, cb) {
            Room.findOne({name: "Lobby"}, function (err, lobby) {
                if (err) {
                    throw err;
                } else {
                    if (null === cb(null, firstUser)) {
                        lobby.players.pop(req.user._id);
                    } else {
                        lobby.players.pop(req.user._id);
                        lobby.players.pop(cb(null, firstUser));
                    }
                }
            });
        }
    ], function (err, res) {
        if (err) {
            throw err;
        } else {
            console.log(res);
        }
    });

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






















