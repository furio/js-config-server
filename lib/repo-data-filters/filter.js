var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-filters');

var FilterData = module.exports = function FilterData( matarializedFilters ) {
    this.matFilters = matarializedFilters;
};

FilterData.prototype.filterData = function(rawData){
    var promiseStart = Promise.resolve(rawData);
    for (var i = 0; i < this.matFilters.length; i++) {
        promiseStart = promiseStart.then(generateClosurePromise(this.matFilters[i]));
    }

    return promiseStart
        .then(function(parsedData) {
            return Promise.resolve(parsedData);
        })
        .catch(function(err) {
            debugLog(err);
            return Promise.reject(err);
        });
};

function generateClosurePromise(filter) {
    return function(stepData) {
        try{
            var resData = filter.filterData(stepData);
            return Promise.resolve(resData);
        } catch(err) {
            return Promise.reject(err);
        }
    }
}