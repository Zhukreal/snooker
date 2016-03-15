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
var passport = require('passport');

var compression = require('compression');
//var io = require('socket.io');

var configDB = require('./config/db.js');

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

/*app.use(function(req,res, next){
 req.session.numberOfVisits = req.session.numberOfVisits + 1 ;
 res.send('visit ' + req.session.numberOfVisits);
 })*/




app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use('/', routes);
//app.use(require('middleware/loadUser'));

require('./routes/route')(app, passport);

app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
