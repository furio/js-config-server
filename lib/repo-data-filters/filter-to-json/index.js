var DataToJsonFilter = module.exports = function DataToJsonFilter(options) {

};

DataToJsonFilter.prototype.filterData = function(rawData) {
    var finalJson = null;

    try {
        finalJson = JSON.parse(rawData);
    } catch (err) {
        throw err;
    }

    return finalJson;
};