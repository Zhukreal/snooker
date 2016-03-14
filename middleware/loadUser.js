var User = require('models/user').User;

module.exports = function(req, res, next) {
    req.user = res.locals.user = null;
    //req.user.local.email = null;

    if (!req.session.user){
        console.log("there is no user!");
        return next();

    }

    User.findById(req.session.user, function(err, user) {
        if (err)
            return next(err);

        req.user = res.locals.user = user;
        next();
    });
};
/*
module.exports = function(req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({ email: req.session.user.email }, function(err, user) {
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
};
*/
