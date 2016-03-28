var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash-light');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('./utils/logger');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var thumbnailPluginLib = require('mongoose-thumbnail');
//var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var passport = require('passport');
var HttpError = require('./error/HttpError').HttpError;

/*var uuid = require('uuid'); // https://github.com/defunctzombie/node-uuid
var multiparty = require('multiparty'); // https://github.com/andrewrk/node-multiparty
var s3 = require('s3'); // https://github.com/andrewrk/node-s3-client*/

var compression = require('compression');
//var io = require('socket.io');

var configDB = require('./config/db.js');

// var fs = require('fs');

var app = express();

mongoose.connect(configDB.url);

//var routes = require('./routes/route');

var users = require('./routes/users');

require('./config/passport')(passport);
//var router = express.Router();


// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(logger('dev'));

//logger/ winston with morgan uncomment after all

/*logger.debug("Overriding 'Express' logger");
 app.use(require('morgan')({ "stream": logger.stream }));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//var sessionStore = require(./lib/sessionStore);
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
    store: /*sessionStore*/ new MongoStore({mongooseConnection: mongoose.connection})
}));

// app.use(require('middleware/sendHttpError'));

/*app.use(function(req,res, next){
 req.session.numberOfVisits = req.session.numberOfVisits + 1 ;
 res.send('visit ' + req.session.numberOfVisits);
 })*/




app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use('/', routes);
//app.use(require('middleware/loadUser'));
//app.use(require('middleware/uploadPhoto'));

require('./routes/route')(app, passport);

app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//app.use(function (req, res, next) {
//    var err = new Error('Forbidden');
//    err.status = 505;
//    next(err);
//});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    session.cookie.secure = true;// serve secure cookies
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
