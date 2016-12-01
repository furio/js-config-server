var Promise = require("bluebird");
var YAML = require("yamljs");
var js2xml = require("js2xmlparser");

module.exports = function(json, outType) {
    switch(outType) {
        case "yml":
            return YAML.dump(json, 2, 2);

        case "xml":
            return js2xml.parse("data", json);

        case "json":
        default:
            return JSON.stringify(json);
    }
};