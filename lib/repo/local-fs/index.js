var Promise = require("bluebird");
var fs = require('fs');
var path = require('path');

// promisify
var readFile = Promise.promisify(fs.readFile);
var access = Promise.promisify(fs.access);
var realPath = Promise.promisify(fs.realpath);

var EXTCONF = ".json";

var LocalRepository = module.exports = function LocalRepository() {};

LocalRepository.prototype.setBaseUri = function(baseUri){
    this.baseUri = baseUri;
    this.realBaseUri = fs.realpathSync(this.baseUri, "utf8");
};

LocalRepository.prototype.get = function(appName, appEnv){
    return realPath(path.resolve(this.realBaseUri, "./" + appName, "./" + appEnv + EXTCONF), "utf8")
        .then(function(resolvedPath) {
            if (resolvedPath.indexOf(this.realBaseUri) !== 0 ) {
                return Promise.reject(new Error("Out of bounds app: " + resolvedPath));
            }

            return readFile(resolvedPath, "utf8")
        })
        .then(function(fileContent) {
            return JSON.parse(fileContent);
        })
        .catch(function(err) {
            return Promise.reject(err);
        });
};

LocalRepository.prototype.checkStatus = function(){
    return access(this.realBaseUri, fs.F_OK)
        .then(function() {
            return Promise.resolve();
        })
        .catch(function(err) {
            return Promise.reject(err);
        });
};