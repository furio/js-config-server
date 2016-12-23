var debugLog = require('debug')('lib-repo-data-filters:filter-encrypted-fields');

var JsonEncryptedFullFilter = require('../full-encrypted-to-raw');

var JsonEncryptedFieldsFilter = module.exports = function JsonEncryptedFieldsFilter(options) {
    this.fullDecryptor = new JsonEncryptedFullFilter(options);
    this.fieldSelection = options.fieldSelection || 'all';
};

JsonEncryptedFieldsFilter.prototype.filterData = function(rawData) {
    var newData = null;

    try {
        newData = _exploreJson(rawData, {}, _fieldExtractor(this.fieldSelection), _decryptFunc(this.fullDecryptor));
    } catch(err) {
        debugLog(err);
        throw err;
    }

    return newData;
};

var _decryptFunc = function(bindObject) {
    return function(input) {
        return bindObject.filterData(input);
    };
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
        /* if we're an array the endObject is an array in the next recursive call */
        if (Array.isArray( jsonObject[key] ) ) {
            endObject[key] = _exploreJson(jsonObject[key], [], fieldExtractor, decryptFunc);
        } /* if we're an object the endObject is an object in the next recursive call */
        else if (typeof jsonObject[key] === 'object') {
            endObject[key] = _exploreJson(jsonObject[key], {}, fieldExtractor, decryptFunc);
        } /* if we're a "primitive type" no need to recursively go down  */
        else {
            endObject[key] = jsonObject[key];
            var decriptableField = fieldExtractor(jsonObject[key]);
            if (decriptableField !== null) {
                endObject[key] = decryptFunc(decriptableField);
            }
        }
    }

    return endObject;
};