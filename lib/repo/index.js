var Promise = require("bluebird");
var Repository = require("./repository");

var fakeRepository = {
    get: function() {
        return Promise.reject(new Error("Unknown repository type"));
    },
    checkStatus: function () {
        return Promise.resolve(false);
    }
};

module.exports = function(repoType, options) {
    var defaultRepo = fakeRepository;

    try {
        var RepoImpl = require("./" + repoType);
        defaultRepo = new Repository( new RepoImpl(options) );
    } catch(ex) {

    }

    return defaultRepo;
};