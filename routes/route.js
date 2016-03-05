//var express = require('express');
//var router = express.Router();

//require('../config/passport')(passport);

module.exports = function (router, passport) {

    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Snooker'
        });
    });

    router.get('/about', function (req, res, next) {
        res.render('about', {
            title: 'About page'
        });
    });

    router.get('/login', function (req, res, next) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    router.get('/signup', function (req, res, next) {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    router.get('/profile', isLoggedIn, function (req, res, next) {
        res.render('profile', {
            user: req.user
        });
    });

    router.get('/logout', function (req, res) {
        req.logout();
       // req.session.destroy();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        else
            res.redirect('/');
    }

    router.post('/signup',
        passport.authenticate('local-signup', {
                successRedirect: '/profile', // redirect to the secure profile section
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            }
        ));

    router.post('/login',
        passport.authenticate('local-login', {
                successRedirect: '/profile', // redirect to the secure profile section
                failureRedirect: '/login', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            }
        ));

    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    router.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    router.get('/chat', function(req,res){
        res.render('chat');
    })
};
//module.exports = router;