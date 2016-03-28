//var express = require('express');
//var router = express.Router();

//require('../config/passport')(passport);
var HttpError = require('../error/HttpError').HttpError;

//var checkAuth = require('../middleware/checkAuth');


module.exports = function (router, passport) {

    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/', function (req, res, next) {
        if (!req.user)
            req.user = null;

        res.render('index', {
            title: 'Snooker'
        });
    });

    router.get('/about', function (req, res, next) {
        res.render('about', {
            title: 'About page'
        });
    });

    router.get('/game', function (req, res, next) {
        res.render('game');
    });


    router.get('/tables', function (req, res, next) {

        if (!req.user) {
            /*res.status(403);
             //res.redirect('503');
             res.render('403');*/
            next(new HttpError(401, "Вы не авторизованы"));
            res.render('error');
            //next(new HttpError(401,'you\'re not auth'));
            req.user = null;
        }

        var nickname;
        if (req.user == null)
            nickname = null;
        else
            nickname = req.user.local.email;

        res.render('tables', {
            userID: req.user,
            userName: nickname
        });
    });

    router.get('/login', function (req, res, next) {
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
        router.post('/logout', function (req, res, next) {
            req.logout();
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
                    successRedirect: '/tables', // redirect to the secure profile section
                    failureRedirect: '/signup', // redirect back to the signup page if there is an error
                    failureFlash: true // allow flash messages
                }
            ));

        // router.post('/signup', function(req, res) {
        //     req.form.complete(function(err, fields, files) {
        //         if (err) {
        //             next(err);
        //         } else {
        //             ins = fs.createReadStream(files.photo.path);
        //             ous = fs.createWriteStream(__dirname + '/public/img' + files.photo.filename);
        //             util.pump(ins, ous, function(err) {
        //                 if (err) {
        //                     next(err);
        //                 } else {
        //                     res.redirect('/photos');
        //                 }
        //             });
        //             console.log('\nUploaded %s to %s', files.photo.filename, files.photo.path);
        //             res.send('Uploaded ' + files.photo.filename + ' to ' + files.photo.path);
        //         }
        //     })
        // });

        router.post('/login',
            passport.authenticate('local-login', {
                    successRedirect: '/tables', // redirect to the secure profile section // profile
                    failureRedirect: '/login', // redirect back to the signup page if there is an error
                    failureFlash: true // allow flash messages
                }
            ))
        ;
        successRedirect
            :
            '/', // redirect to the secure profile section // profile
                failureRedirect
        :
        '/login', // redirect back to the signup page if there is an error
            failureFlash
        :
        true // allow flash messages
    })
    );

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

router.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

router.get('/chat', function (req, res) {
    res.render('chat');
})
}
;
//module.exports = rout
