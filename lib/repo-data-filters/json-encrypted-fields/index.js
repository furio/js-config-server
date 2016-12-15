var Promise = require('bluebird');
var CryptoJS = require("crypto-js");

var JsonEncryptedFieldsFilter = module.exports = function JsonEncryptedFieldsFilter(options) {
    this.fieldSelection = options.fieldSelection || 'all';
    this.encryptionAlgorithm = options.crypt || 'none';
    this.encryptionKey = options.key;
    this.decryptFunc = null;
};

JsonEncryptedFieldsFilter.prototype.filterData = function(rawData) {
    if (this.decryptFunc === null) {
        var decryptFunc = null;

        switch(this.encryptionAlgorithm) {
            case 'aes':
                {
                    var aesIV = CryptoJS.PBKDF2(this.encryptionKey, this.fieldSelection);
                    decryptFunc = function () {
                        return function (input) {
                            var decByte = CryptoJS.AES.decrypt(input.toString(), this.encryptionKey, {
                                iv: aesIV,
                                mode: CryptoJS.mode.OFB,
                                padding: CryptoJS.pad.NoPadding
                            });
                            return decByte.toString(CryptoJS.enc.Utf8);
                        };
                    };
                } break;

            case 'rabbit':
                decryptFunc = function() { return function (input) {
                    var decByte = CryptoJS.Rabbit.decrypt(input.toString(), this.encryptionKey);
                    return decByte.toString(CryptoJS.enc.Utf8);
                }; };
                break;

            default:
                decryptFunc = function() { return  function(input) { return input; }; };
                break;
        }

        this.decryptFunc = decryptFunc();
    }

    var newData = rawData;
    try {
        newData = _exploreJson(rawData, {}, _fieldExtractor(this.fieldSelection), this.decryptFunc.bind(this));
    } catch(err) {
        return Promise.reject(err);
    }

    return Promise.resolve(newData);
};

var ENC_DELIMITER = "<enc>";

var _fieldExtractor = function(selector) {
    return function(input) {
        switch(selector) {
            /* Only those that contains in value <enc> at the beginning are passed through the decryptor */
            case 'enc':
            {
                if (input.toString().indexOf(ENC_DELIMITER) === 0) {
                    return input.substr(ENC_DELIMITER.length, input.length);
                }
            } break;

            /* Select all simple fields */
            case 'all':
            default:
                return input;
        }

        return null;
    }
};

var _exploreJson = function(jsonObject, endObject, fieldExtractor, decryptFunc) {
    for(var key in jsonObject) {
        if (typeof jsonObject[key] == 'object') {
            endObject[key] = _exploreJson(jsonObject[key], {}, fieldExtractor, decryptFunc);
        } else {
            endObject[key] = jsonObject[key];
            var decriptableField = fieldExtractor(jsonObject[key]);
            if (decriptableField !== null) {
                endObject[key] = decryptFunc(decriptableField);
            }
        }
    }

    return endObject;
};