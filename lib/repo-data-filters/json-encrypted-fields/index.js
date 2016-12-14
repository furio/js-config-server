var Promise = require('bluebird');
var CryptoJS = require("crypto-js");

var JsonEncryptedFieldsFilter = module.exports = function JsonEncryptedFieldsFilter(options) {
    this.encryptionAlgorithm = options.crypt || 'none';
    this.encryptionKey = options.key;
};

JsonEncryptedFieldsFilter.prototype.filterData = function(rawData) {
    var decryptFunc = null;

    switch(this.encryptionAlgorithm) {
        case 'aes':
            decryptFunc = function() { return function (input) {
                    var decByte = CryptoJS.AES.decrypt(input.toString(), this.encryptionKey);
                    return decByte.toString(CryptoJS.enc.Utf8);
                } };
            break;

        default:
            decryptFunc = function() { return  function(input) { return input; } };
            break;
    }

    return _exploreJson(rawData, {}, decryptFunc().bind(this));
};

var _exploreJson = function(jsonObject, endObject, decryptFunc) {
    for(var key in jsonObject) {
        if (typeof jsonObject[key] == 'object') {
            endObject[key] = _exploreJson(jsonObject[key], {}, decryptFunc);
        } else {
            endObject[key] = decryptFunc(jsonObject[key]);
        }
    }

    return endObject;
};