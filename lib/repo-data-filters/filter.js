var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-filters');

var FilterData = module.exports = function FilterData( materializedFilters ) {
    this.matFilters = materializedFilters;
};

FilterData.prototype.filterData = function(rawData){

    try {
        var finalData = this.matFilters.reduce(function(partialData, filterFun) {
            return filterFun.filterData(partialData);
        }, rawData);

        return Promise.resolve(finalData);
    } catch(err) {
        debugLog(err);
        return Promise.reject(err);
    }
};