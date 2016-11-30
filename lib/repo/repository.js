var Promise = require("bluebird");

var Repository = module.exports = function Repository(baseUri, materializedRepository) {
    this.matRepo = materializedRepository;
    this.matRepo.setBaseUri(baseUri);
};

Repository.prototype.getAppConfig = function(appName, appEnv){
    return this.matRepo.get(appName, appEnv)
        .then(function(configData) {
            return Promise.resolve(configData);
        })
        .catch(function(err) {
            return Promise.reject(err);
        });
};

Repository.prototype.checkStatus = function(){
    return this.matRepo.checkStatus()
        .then(function() {
            return Promise.resolve(true);
        })
        .catch(function(err) {
            return Promise.resolve(false);
        });
};