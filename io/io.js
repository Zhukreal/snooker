const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const connect = require('connect'); // npm i connect
const async = require('async');
const cookie = require('cookie');   // npm i cookie
const cookieParser = require('cookie-parser');
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
var User = require('../models/user');//.User;
const crypto = require('crypto');
const possport = require('passport');

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
        console.log/*log/ger/.debug*/("Session %s is anonymous", session.id);
        return callback(null, null);
    }
    console.log/*log/ger/.debug*/("retrieving user ", session.user);

    User.findById(session.user._id, function (err, user) {
        if (err) {
            //console.log(session.user._id);
            return callback(err);
        }

        if (!user) {
            return callback(null, null);
        }
        console.log/*log.debug*/("user findbyId result: " + user);
        callback(null, user);
    });

}


module.exports = function (server) {

    const io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');
    console.log('io is being connected');

    io.set('authorization', function (handshake, callback) {
        async.waterfall([
            /*function(callback){
             if(!handshake.headers.cookie)
             callback('No cookie transmitted', false);
             },*/
            function (callback) {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies['connect.sid'];


                /*
                 var sidTemp = connect.utils.parseSignedCookie(sidC, config.get('session:secret'));
                 console.log(sidTemp);

                 var sidCookie = handshake.cookies[config.get('session:key')];

                 var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));*/

                var sid = cookieParser.signedCookie(sidCookie, 'keyboard cat');
                console.log(sid);
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
                }

                if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            });

        });

    });


    var player = require('../models/user');

    function randomstring(L) {
        var s = '';
        var randomchar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10)
                return n; //1-10
            if (n < 36)
                return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        };
        while (s.length < L)
            s += randomchar();
        return s;
    }

    var userCount = 0;

    io.sockets.on('connection', function (socket) {
        console.log("a user connected");
        userCount++;
        socket.player = player;

        var userName = socket.client.request.user.local.nickname;

        var userId = socket.client.request.user._id;

        console.log(randomstring(15));
        //var id = crypto.randomBytes(15).toString('hex');
        io.sockets.emit('userCount', {userCount: userCount});
        socket
            .emit('initPlayer', {
                nickName: userName,
                playerId: userId
            })
            .on('connectToRoom', function (room) {
                socket.join(room);
            })
            .on('disconnect', function () {
                userCount--;
                socket.broadcast.emit('leave', userName);
                socket.emit('userCount', {userCount: userCount});
            })
    });

};