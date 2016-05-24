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
            if (arguments.length === 0) {
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
                //console.log("Session ID : ", sid);
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
                    callback();

                    Object.prototype.getFirstElement = function (arr) {
                        for (var i in arr) {
                            return arr[i];
                            break;
                        }
                    };

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


    io.sockets.on('connection', function (socket) {
        io.of('/about').on('connection', function (socket) {
            console.log('user %s connected into the about page', socket.client.request.user.profile.nickname);
            socket
                .emit('firstEvent', {'var': 2})
        });
        io.of('/tables').on('connection', function (socket) {
            socket.room = generateRoom();
            console.log('user %s connected into the tables page', socket.client.request.user.profile.nickname);
            socket.emit('totalCountOfUsers', Object.keys(io.engine.clients));
            setInterval(function () {
                io.sockets.emit('totalCountOfUsers', Object.keys(io.engine.clients))
            }, 10000);
            async.waterfall([
                function (cb) {
                    Room.find({'roomState': "incomplete"}, function (err, iRoom) {
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('countOfIncompleteRooms', {
                                'count': iRoom.length,
                                'firstRoom': Object.getFirstElement(iRoom),
                                'rndRoomName': socket.room
                            }, function (confirmation) {
                                //console.log(confirmation);
                                cb(null, confirmation);
                            });
                        }
                    });
                },
                function (rName, cb) {

                }
            ]);
        });
        /*console.log('room',socket.room);*/
        //console.log("http://localhost:8080/game/xotV5lNMQx9JVtu".match(/\/game\/(\S+)/)[0])
        io.of('\/(\S+)').on('connection', function (socket) {//\/game\/(\w+)
            console.log("http://localhost:8080/game/xotV5lNMQx9JVtu".match(/\/(\S+)/))
            console.log('socket nsp', socket.nsp.name);
            socket.emit('lol', {'fuck': 'this'});
        });
        socket.on('joinGameRoom', function (data) {
            console.log(data);
            socket.roomName = data.roomName;
            socket.join(data.roomName);
            io.sockets['in'](data.roomName).emit('lol', {
                'text': 'Player ' + socket.client.request.user.profile.nickname + ' has joined into the game'
            });
        });
        socket.on('disconnect', function () {
            io.sockets['in'](socket.roomName).emit('leave', socket.client.request.user.profile.nickname);
        });
        socket.emit('initPlayer', {'user': socket.client.request.user})
    });


    /* io.of(^\\/game\\/(\\d+)$).on('connection', function(socket){
     console.log('lol');
     })*/

    /*
     /!*
     socket.emit('count', {
     count: Object.keys(io.sockets.connected).length
     });
     });*!/
     });*/

};