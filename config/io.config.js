const session = require('express-session');
const cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var User = require('../models/user');
const cookie = require('cookie');
const connect = require('connect');

module.exports = function (io) {

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

    })
};