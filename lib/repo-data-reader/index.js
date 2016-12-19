var Promise = require("bluebird");
var debugLog = require('debug')('lib-repo-data-reader');
var RepositoryData = require("./repository");


var fakeRepositoryData = {
    getConfigData: function() {
        return Promise.reject(new Error("Unknown repository type"));
    },
    isAvailable: function () {
        return Promise.resolve(false);
    }
};

module.exports = function(repoOptions) {
    var defaultRepo = fakeRepositoryData;

    try {
        var RepoImpl = require("./" + repoOptions.type);
        defaultRepo = new RepositoryData( new RepoImpl(repoOptions.options) );
    } catch(ex) {
        debugLog(ex);
    }

    return defaultRepo;
};