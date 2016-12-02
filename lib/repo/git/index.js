var NodeGit = require("nodegit");
var Promise = require("bluebird");
var fs = require('fs');
var path = require('path');

// A git repo is a local dir, or a cloneable remote repo in a local dir
var LocalRepository = require("../local-fs");


var GitRepository = module.exports = function GitRepository(options) {
    this.type = options.type;
    this.initPromise = Promise.resolve();

    this.localRepo = null;
    if (this.type === "local") {
        this.localRepo = new LocalRepository({baseUri: options.uri});
    }

    if (this.type === "remote") {
        this.initPromise = NodeGit.Clone(options.uri, options.tempUri, {})
            .bind(this)
            .then(function() {
                this.localRepo = new LocalRepository({baseUri: options.tempUri});
            });
    }
};

GitRepository.prototype.get = function(appName, appEnv) {
    if (appName === ".git") {
        return Promise.reject(new Error("Out of bounds app: " + appName));
    }

    return this.initPromise
            .bind(this)
            .then(function() {
                return this.localRepo.get(appName, appEnv)
            });
};

GitRepository.prototype.checkStatus = function() {
    return this.initPromise
            .bind(this)
            .then(function() {
                return this.localRepo.checkStatus()
            })
            .catch(function (err) {
                return Promise.resolve(false);
            });
};

