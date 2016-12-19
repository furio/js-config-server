var NodeGit = require("nodegit");
var Promise = require("bluebird");
var fs = require('fs-extra');
var path = require('path');
var os = require('os');
var validator = require('validator');
var debugLog = require('debug')('lib-repo-data-reader:git');

var removeDir = Promise.promisify(require('fs-extra').remove);

// A git repo is a local dir, or a cloneable remote repo in a local dir
var LocalRepositoryData = require("../local-fs");

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

var checkOptions = function(options) {
    if (!options.hasOwnProperty("type"))
        throw new Error("A type must be specified");
    if (!(options.type === "local" || options.type === "remote"))
        throw new Error("Wrong type for git repository");

    if (!options.hasOwnProperty("uri"))
        throw new Error("An uri must be specified");
    if (validator.isEmpty(options.uri))
        throw new Error("An uri must be specified");

    if ((options.type === "remote") && !options.hasOwnProperty("tempUri"))
        throw new Error("A temp uri must be specified");
    if ((options.type === "remote") && validator.isEmpty(options.tempUri))
        throw new Error("A temp uri must be specified");
};

var GitRepositoryData = module.exports = function GitRepository(options) {
    // Safety check
    checkOptions(options);

    // Base vars
    this.type = options.type;
    this.initPromise = Promise.resolve();
    this.repoIsInited = false;
    this.localRepo = null;

    // local case
    if (this.type === "local") {
        this.localRepo = new LocalRepositoryData({baseUri: options.uri});
        this.repoIsInited = true;
    } /* remote case */
    else if (this.type === "remote") {
        this.useBranch = options.branch || "master";

        this.initPromise = Promise.resolve()
            .bind(this)
            .then(function() {
                return this.__initRemoteRepo(options);
            })
    }
};

GitRepositoryData.prototype.__initRemoteRepo = function(options) {
    return removeDir(options.tempUri)
            .bind(this)
            .then(function() {
                return NodeGit.Clone(options.uri, options.tempUri, generateGitOptions(this.useBranch));
            })
            .then(function(clonedRepo) {
                this.localRepo = new LocalRepositoryData({baseUri: options.tempUri});
                this.gitRepoObject = clonedRepo;
                this.recurrentCheckout = setInterval(this.__refreshRepo.bind(this), options.refreshRepo || 30000);
                this.repoIsInited = true;
            });
};

GitRepositoryData.prototype.__refreshRepo = function() {
    return this.initPromise
            .bind(this)
            .then(function() {
                return this.gitRepoObject.fetchAll(generateGitOptions());
            }).then(function() {
                return this.gitRepoObject.mergeBranches(this.useBranch, "origin/" + this.useBranch);
            }).catch(function(err) {
                debugLog(err);
            });
};

GitRepositoryData.prototype.getConfigData = function(appName, appEnv) {
    if (appName === ".git") {
        return Promise.reject(new Error("Out of bounds app: " + appName));
    }

    return this.initPromise
            .bind(this)
            .then(function() {
                return this.localRepo.getConfigData(appName, appEnv)
            });
};

GitRepositoryData.prototype.isAvailable = function() {
    return this.initPromise
            .bind(this)
            .then(function() {
                return this.repoIsInited && this.localRepo.isAvailable()
            })
            .catch(function (err) {
                debugLog(err);
                return Promise.resolve(false);
            });
};
