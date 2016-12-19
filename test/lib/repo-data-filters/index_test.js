var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var CryptoJS = require("crypto-js");
var FilterDataGenerator = require('../../../lib/repo-data-filters/index');