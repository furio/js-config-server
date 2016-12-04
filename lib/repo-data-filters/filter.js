var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-filters');

var FilterData = module.exports = function FilterData( matarializedFilter ) {
    this.matFilter = matarializedFilter;
};

FilterData.prototype.filterData = function(rawData){
    return this.matFilter.filterData(rawData)
        .then(function(parsedData) {
            return Promise.resolve(Promise);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};