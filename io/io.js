const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const connect = require('connect'); // npm i connect
const async = require('async');
const cookie = require('cookie');   // npm i cookie

const cookieParser = require('cookie-parser');
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
var User = require('../models/user');//.User;

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
                //console.log(handshake.cookies);
                var sidCookie = handshake.cookies['connect.sid'];

                //handshake.query.temp = "temp";
                //console.log(handshake.temp);

                console.log('lol');
                handshake.cookies.temp = "lol";
                //console.log(sidCookie)
                //console.log(sidC);
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
                }
                handshake.session = session;
                //console.log(handshake.session);
                loadUser(session, callback);
            },
            function (user, callback) {

                if (!user) {
                    callback(new Error(403, "Anonymous session may not connect"));
                }

                handshake.user = user;

                //io.handshake.user = user;

                //console.log(handshake.user);

                //console.log(handshake.user.local.nickname);

                callback(null, true);
            }

        ], function (err) {
            if (!err) {
                return callback(null, true);
            }

            if (err instanceof Error) {
                return callback(null, false);
            }

            callback(err);
        });

        //callback(null, true);

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


    io.sockets.on('connection', function (socket) {
        console.log("a user connected");

        //console.log()


        var userName = socket.handshake.user.local.nickname;

        console.log(socket.handshake);

        //console.log(userName);

        //console.log(socket.handshake);

        socket.on('initPlayer', function (data) {
            console.log(data);
        });


        socket.on('connectToRoom', function (room) {
            socket.join(room);

            //console.log(socket.rooms);
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', userName);
        })
    });

};