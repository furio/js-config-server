var YAML = require("yamljs");
var debugLog = require('debug')('lib-repo-data-filters:raw-yaml-to-json');

var RawYamlToJsonFilter = module.exports = function YamlToJsonFilter(options) {

};

RawYamlToJsonFilter.prototype.filterData = function(rawData) {
    var finalJson = null;

    try {
        finalJson = YAML.parse(rawData);
    } catch (err) {
        debugLog(err);
        throw err;
    }

    return finalJson;
};
