var debugLog = require('debug')('lib-repo-data-filters:raw-json-to-json');

var RawJsonToJsonFilter = module.exports = function DataToJsonFilter(options) {

};

RawJsonToJsonFilter.prototype.filterData = function(rawData) {
    var finalJson = null;

    try {
        finalJson = JSON.parse(rawData);
    } catch (err) {
        debugLog(err);
        throw err;
    }

    return finalJson;
};