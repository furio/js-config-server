var NodeGit = require("nodegit");
var Promise = require("bluebird");
var fs = require('fs-extra');
var path = require('path');
var os = require('os');
var debugLog = require('debug')('js-config-server:lib-repo-git');

var removeDir = Promise.promisify(require('fs-extra').remove);

// A git repo is a local dir, or a cloneable remote repo in a local dir
var LocalRepository = require("../local-fs");

var generateGitOptions = function(checkoutBranch) {
    var options = {};

    if (checkoutBranch) {
        options['checkoutBranch'] = checkoutBranch;
    }

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
    this.repoIsInited = false;

    this.localRepo = null;
    if (this.type === "local") {
        this.localRepo = new LocalRepository({baseUri: options.uri});
        this.repoIsInited = true;
    }

    if (this.type === "remote") {
        this.useBranch = options.branch || "master";

        this.initPromise = removeDir(options.tempUri)
            .bind(this)
            .then(function() {
                return NodeGit.Clone(options.uri, options.tempUri, generateGitOptions(this.useBranch));
            })
            .then(function(clonedRepo) {
                this.localRepo = new LocalRepository({baseUri: options.tempUri});
                this.gitRepoObject = clonedRepo;
                this.repoIsInited = true;
                this.recurrentCheckout = setInterval(this.__refreshRepo.bind(this), options.refreshTimeout || 10000);
            });
    }
};

GitRepository.prototype.__refreshRepo = function() {
    return Promise.resolve()
            .bind(this)
            .then(function() {
                return this.gitRepoObject.fetchAll(generateGitOptions());
            }).then(function() {
                return this.gitRepoObject.mergeBranches(this.useBranch, "origin/" + this.useBranch);
            }).catch(function(err) {
                debugLog(err);
            });
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
                return this.repoIsInited && this.localRepo.checkStatus()
            })
            .catch(function (err) {
                debugLog(err);
                return Promise.resolve(false);
            });
};
