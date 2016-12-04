var Promise = require('bluebird');


var DataToJsonFilter = module.exports = function DataToJsonFilter(options) {

};

// TODO: try/catch for .parse
DataToJsonFilter.prototype.filterData = function(rawData) {
    // Fast stuff, make better
    return Promise.resolve(JSON.parse(rawData));
}