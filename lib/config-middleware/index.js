var Promise = require("bluebird");

module.exports = function(configData) {
    return function(req, res, next) {
        req.configData = configData;
        next();
    }
};