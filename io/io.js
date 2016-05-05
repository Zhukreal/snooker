const session = require('express-session');
const connect = require('connect');
const async = require('async');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var User = require('../models/user');
var player = require('../models/user');
var Room = require('../models/room');
const crypto = require('crypto');

module.exports = function (server) {


    const io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');

    //require('../config/io.config')(io);

    console.log('io is being connected');


    function loadSession(sid, callback) {
        sessionStore.load(sid, function (err, session) {
            if (arguments.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, session);
            }
        });
    }

    function loadUser(session, callback) {
        if (!session.user) {
            console.log("Session %s is anonymous", session.id);
            return callback(null, null);
        } else {
            console.log("retrieving user ", session.user._id);
            User.findById(session.user._id, function (err, user) {
                if (err) {
                    return callback(err);
                }
                if (!user) {
                    return callback(null, null);
                }
                callback(null, user);
            });
        }
    }

    io.set('authorization', function (handshake, callback) {
        async.waterfall([
            function (callback) {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies['connect.sid'];
                var sid = cookieParser.signedCookie(sidCookie, 'keyboard cat');
                console.log("Session ID : ", sid);
                loadSession(sid, callback);
            },
            function (session, callback) {
                if (!session) {
                    callback(new Error(401, "No session"));
                } else {
                    handshake.session = session;
                    loadUser(session, callback);
                }
            },
            function (user, callback) {
                if (!user) {
                    callback(new Error(403, "Anonymous session may not connect"));
                }
                else {
                    handshake.user = user;
                    callback(null, true);
                }
            }

        ], function (err) {
            if (!err) {
                return callback(null, true);
            }
            else if (err instanceof Error) {
                return callback(null, false);
            } else {
                callback(err);
            }
        });

    });


    io.on('session:reload', function (sid) {
        var clients = io.sockets.clients();

        clients.forEach(function (client) {
            if (client.handshake.session.id != sid) return;

            loadSession(sid, function (err, session) {
                if (err) {
                    client.emit("error", "server error");
                    client.disconnect();
                    return;
                } else if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }
                client.handshake.session = session;
            });

        });

    });

    function randomString(L) {
        var s = '';
        var randomChar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10)
                return n; //1-10
            if (n < 36)
                return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        };
        while (s.length < L)
            s += randomChar();
        return s;
    }


    function generateRoom() {
        return randomString(15);
    }


    var roomId = generateRoom();

    io.sockets.on('connection', function (socket) {

        var userCount = 0;
        socket.usetCount = userCount;
        userCount++;

        socket.player = player;


        var userName = socket.client.request.user.local.nickname;
        console.log("a user %s connected ", userName);
        var userId = socket.client.request.user._id;

        socket.room = roomId;

        var closeRoom = function (roomId, opponent) {
            socket.leave(roomId);
            io.sockets.socket(opponent).leave(roomId);
            countGames--;
        };

        async.parallel([
            function (cb) {
                Room.find({}, function (err, room) {
                    if (err)
                        throw err;
                    cb(room);
                })
            }
        ], function (res) {
            socket.emit('numberOfRooms', res);
        });



        //console.log("Another count of rooms ", tempCount)
        io.sockets.emit('userCount', {userCount: userCount});


        socket
            .emit('countTemp', Object.keys(io.engine.clients))
            .emit('initPlayer', {
                nickName: userName,
                playerId: userId,
                roomId: roomId
            })
            .emit('start', function(){
                var game = require('../models/game');
                game.find({},function(err,game){
                    if(err)
                        throw err;

                })
            })
            /*.on('join', function(){
             socket*/.join(roomId, function (err) {
                if (!err) {
                    rooms = socket.rooms;


                    //console.log(rooms);


                    io.sockets['in'](roomId).emit('joinedToRoom', {
                        'text': 'Player ' + userName + ' has joined into the game'
                    });
                } else {
                    console.log(err, e);
                }
            })
            //.emit('countOfUsers', {countOfUsers: tempCount})
            /*})*/
            .on('leave', function (roomId) {
                socket.leave(roomId);
            })
            //.emit('someEvent',{jarosh: "pidor"})

            .emit('message', {message: "Waiting for opponent..."})
            .on('searchRoom', function (name) {
                var gotRoom = false;
                console.log('searching...');
                for (var i = 0; i < rooms.length; ++i) {

                }
            })
            .on('connectToRoom', function (room) {
                socket.join(room);
            })
            .on('disconnect', function () {
                userCount--;
                socket.broadcast.emit('leave', userName);
                socket.emit('userCount', {userCount: userCount});
            });

        setInterval(function () {
            io.sockets.emit('countTemp', Object.keys(io.engine.clients))
        }, 5000);

        /*
         socket.emit('count', {
         count: Object.keys(io.sockets.connected).length
         });
         });*/

    });

};