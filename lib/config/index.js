var Promise = require("bluebird");
var YAML = require("yamljs");
var path = require("path");

module.exports = YAML.load(path.resolve(__dirname, './../../config/config.yml'));