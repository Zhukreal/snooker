var HttpError = require('../error/HttpError').HttpError;

module.exports = function(req, res, next) {
    if (!req.user) {
        return next(new HttpError(401, "Вы не авторизованы"));
    }
    next();
};