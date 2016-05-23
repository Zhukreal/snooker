//require('../config/passport')(passport);
var HttpError = require('../error/HttpError').HttpError;
var multer = require('multer');
var path = require('path');
//var checkAuth = require('../middleware/checkAuth');
var createRoom = require("../middleware/createRoom");

module.exports = function (router, passport) {

    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
    router.get('/', function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('tables');
        }
        res.render('index', {
            title: 'Snooker'
        });
    });

    router.get('/about', function (req, res, next) {
        console.log("req.session: ", req.session);
        res.render('about', {
            title: 'About page'
        });
    });


    router.get('/game/:id', createRoom, /*require('../middleware/loadRoom'),*/ function (req, res, next) {
        if (req.user) {
            res.render('game',{
                currentRoomName: req.params.id,
                playerPhoto : req.user.profile.photo.data
            });
        } else {
            res.redirect('/');
        }

    });


    router.get('/tables', function (req, res, next) {
        if (!req.user) {
            //res.status(403);
            //res.redirect('503');
            //res.render('403');!
            next(new HttpError(401, "Вы не авторизованы"));
            res.render('error');
            //next(new HttpError(401,'you\'re not auth'));
            req.user = null;
        }

        var nickname;
        if (req.user == null)
            nickname = null;
        else
            nickname = req.user.profile.nickname;

        //console.log(req.user.local.cash);

        //User.update({_id: req.id}, {$set: {'local.cash': 45}});

        //req.session.table = "table";

        res.render('tables', {
            userID: req.user,
            userName: nickname,
            userPhoto: req.user.profile.photo.data,
            roomId: randomString(15)
        });
    });

    router.get('/login', function (req, res, next) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    router.get('/signup', function (req, res, next) {
        res.render('signup', {
            message: req.flash('signupMessage'),
            temp: "lol"
        });
    });

    router.get('/profile/:id', isLoggedIn, function (req, res, next) {
        res.render('profile', {
            user: req.user
        });
    });


    router.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });
    router.post('/logout', function (req, res, next) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        else
            res.redirect('/');
    }

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

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/userPhotos')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            //console.log(req.user);
            //console.log(file.originalname.split('.')[file.originalname.split('.').length - 1]);
            cb(null, /*file.fieldname*/  /*file.originalname.split('.')[file.originalname.split('.').length - 1]*/ /*datetimestamp + file.fieldname*/ /*+ */file.originalname.split('.', 1) + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1] /*+ path.extname(file.originalname)*/)
        }
    });
    var upload = multer({storage: storage});

    router.post('/signup',
        /*multer(
         {
         extension: true,
         dest: './public/userPhotos',
         filename: function (req, file, cb) {
         var datetimestamp = Date.now();
         console.log(datetimestamp);
         cb(null, datetimestamp + '.jpg' /!*file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1] + path.extname(file.originalname)*!/)
         }

         })*/
        upload.single('file'),


        passport.authenticate('local-signup', {
            successRedirect: '/tables', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages

        })
    );


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
        ));


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
    });
};
//module.exports = rout
