
module.exports = function (io) {
/*    const io = require('socket.io').listen(server);*/
    io.set('origins', 'localhost:*');
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
}
