var NodeGit = require("nodegit");
var Promise = require("bluebird");
var fs = require('fs');
var path = require('path');
var os = require('os');

// A git repo is a local dir, or a cloneable remote repo in a local dir
var LocalRepository = require("../local-fs");

var generateCloneOptions = function() {
    var options = {};

    if (os.platform() === "darwin") {
        options['fetchOpts'] = {
            callbacks: {
                certificateCheck: function() { return 1; }
            }
        };
    }

    return options;
}


var GitRepository = module.exports = function GitRepository(options) {
    this.type = options.type;
    this.initPromise = Promise.resolve();

    this.localRepo = null;
    if (this.type === "local") {
        this.localRepo = new LocalRepository({baseUri: options.uri});
    }

    if (this.type === "remote") {
        this.initPromise = this.initPromise
            .bind(this)
            .then(NodeGit.Clone(options.uri, options.tempUri, generateCloneOptions()))
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
