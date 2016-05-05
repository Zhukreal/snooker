const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

mongoose.connection.on('error', function(err){
    console.error("MongoDB connection error. Please, make sure MongoDB is running ", err);
    mongoose.disconnect();
});

mongoose.connection.on('disconnect', function(){
    connect();
});

module.exports = sessionStore;
