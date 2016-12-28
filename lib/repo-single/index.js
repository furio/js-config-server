var Promise = require("bluebird");
var debugLog = require('debug')('lib-repo-single');

var RepositoryData = require("./../repo-data-reader");
var FilterData = require("./../repo-data-filters");

var Repository = module.exports = function Repository( repoOptions ) {
    this.repositoryData = new RepositoryData( repoOptions );
    this.filterData = new FilterData( repoOptions.filters || {} );
};

Repository.prototype.getAppConfig = function(appName, appEnv) {
    return Promise.resolve()
        .bind(this)
        .then(function() {
            return this.repositoryData.getConfigData(appName,appEnv);
        })
        .then(function(rawData) {
            return this.filterData.filterData(rawData);
        }).catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};

Repository.prototype.healthCheck = function() {
    return this.repositoryData.isAvailable();
};

