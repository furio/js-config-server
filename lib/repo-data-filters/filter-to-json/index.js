var debugLog = require('debug')('lib-repo-data-filters:filter-to-json');

var DataToJsonFilter = module.exports = function DataToJsonFilter(options) {

};

DataToJsonFilter.prototype.filterData = function(rawData) {
    var finalJson = null;

    try {
        finalJson = JSON.parse(rawData);
    } catch (err) {
        debugLog(err);
        throw err;
    }

    return finalJson;
};