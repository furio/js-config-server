var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-');

var RepositoryData = require("./../repo-data-reader");
var FilterData = require("./../repo-data-filters");

// TODO: review options
var Repository = module.exports = function Repository( cfgOptions ) {
    this.repositoryData = new RepositoryData( cfgOptions.repo.type, cfgOptions.repo.options );
    // TODO: properly use options here
    this.filterData = new FilterData( "filter-to-json", {} );
};

Repository.prototype.getAppConfig = function(appName, appEnv) {
    return  Promise.resolve()
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

