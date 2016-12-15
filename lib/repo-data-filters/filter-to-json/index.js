var Promise = require('bluebird');


var DataToJsonFilter = module.exports = function DataToJsonFilter(options) {

};

DataToJsonFilter.prototype.filterData = function(rawData) {
    var finalJson = null;

    try {
        finalJson = JSON.parse(rawData);
    } catch (err) {
        return Promise.reject(err);
    }

    return Promise.resolve(finalJson);
};