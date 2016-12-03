var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo');

var Repository = module.exports = function Repository( materializedRepository ) {
    this.matRepo = materializedRepository;
};

Repository.prototype.getAppConfig = function(appName, appEnv){
    return this.matRepo.get(appName, appEnv)
        .then(function(configData) {
            return Promise.resolve(configData);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};

Repository.prototype.checkStatus = function(){
    return this.matRepo.checkStatus()
        .then(function() {
            return Promise.resolve(true);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.resolve(false);
        });
};