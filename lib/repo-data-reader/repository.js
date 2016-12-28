var Promise = require("bluebird");
var debugLog = require('debug')('lib-repo-single-data-reader');

var RepositoryData = module.exports = function Repository( materializedRepository ) {
    this.matRepo = materializedRepository;
};

RepositoryData.prototype.getConfigData = function(appName, appEnv) {
    return this.matRepo.getConfigData(appName, appEnv)
        .then(function(configData) {
            return Promise.resolve(configData);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};

RepositoryData.prototype.isAvailable = function(){
    return this.matRepo.isAvailable()
        .then(function() {
            return Promise.resolve(true);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.resolve(false);
        });
};