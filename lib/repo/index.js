var Promise = require("bluebird");
var Repository = require("./repository");


module.exports = function(repoType, uri) {
    switch(repoType) {
        case "local-fs":
        {
            var LocalRepo = require("./local-fs");
            return new Repository( uri, new LocalRepo() );
        }

        default:
        {
            return {
                get: function() {
                    throw new Error("Unknown repository type");
                },
                checkStatus: function () {
                    return false;
                }
            };
        }
    }
};