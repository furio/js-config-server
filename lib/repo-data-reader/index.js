var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-reader');
var RepositoryData = require("./repository");


var fakeRepositoryData = {
    getConfigData: function() {
        return Promise.reject(new Error("Unknown repository type"));
    },
    isAvailable: function () {
        return Promise.resolve(false);
    }
};

// TODO: leave repotype is options
module.exports = function(repoType, options) {
    var defaultRepo = fakeRepositoryData;

    try {
        var RepoImpl = require("./" + repoType);
        defaultRepo = new RepositoryData( new RepoImpl(options) );
    } catch(ex) {
        debugLog(ex);
    }

    return defaultRepo;
};