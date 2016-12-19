var Promise = require("bluebird");
var fs = require('fs');
var path = require('path');
var debugLog = require('debug')('lib-repo-data-reader:local-fs');

// promisify
var readFile = Promise.promisify(fs.readFile);
var access = Promise.promisify(fs.access);
var realPath = Promise.promisify(fs.realpath);

var EXTCONF = ".json";

var LocalRepositoryData = module.exports = function LocalRepository(options) {
    this.baseUri = options.baseUri;
    this.realBaseUri = fs.realpathSync(this.baseUri, "utf8");
};

LocalRepositoryData.prototype.getConfigData = function(appName, appEnv){
    return realPath(path.resolve(this.realBaseUri, "./" + appName, "./" + appEnv + EXTCONF), "utf8")
        .bind(this)
        .then(function(resolvedPath) {
            if (resolvedPath.indexOf(this.realBaseUri) !== 0 ) {
                return Promise.reject(new Error("Out of bounds app: " + resolvedPath));
            }

            return readFile(resolvedPath, "utf8")
        })
        .then(function(fileContent) {
            return fileContent;
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};

LocalRepositoryData.prototype.isAvailable = function(){
    return access(this.realBaseUri, fs.F_OK)
        .then(function() {
            return Promise.resolve();
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};