var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');

var configAuth = require('./auth');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    // LOCAL SIGNUP
    passport.use('local-signup', new LocalStrategy({
            nicknameField: 'nickname',
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req,email, password, done) {
            // asynchronous
            process.nextTick(function () {

                User.findOne({'local.email': email}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.nickname = req.body.nickname;
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });
            });
        }));
    // LOCAL LOGIN
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            User.findOne({'local.email': email}, function (err, user) {
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                }
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                req.session.user = user;
                return done(null, user);
            });

        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL

        },
        function (token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {

                // try to find the user based on their google id
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser = new User();

                        // set all of the relevant information
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL

        },
        function (token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {

                User.findOne({'twitter.id': profile.id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();

                        // set all of the user data that we need
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // save our user into the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            });
        }))

};


