var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var CryptoJS = require("crypto-js");
var FilterData = require('../../../lib/repo-data-filters/filter');

describe('FilterData', function() {
    var JsonEncryptedFullFilter = require('../../../lib/repo-data-filters/full-encrypted-to-raw');
    var DataToJsonFilter = require('../../../lib/repo-data-filters/raw-json-to-json');
    var JsonEncryptedFieldsFilter = require('../../../lib/repo-data-filters/json-encrypted-fields/index');
    var cryptInput = function(input, key, encType) {
        return CryptoJS.AES.encrypt(input, key).toString();
    };
    var cryptFieldInput = function(input, key, encType) {
        return "<enc>"+cryptInput(input, key, encType);
    };

    describe('#([raw-json-to-json])', function() {
    });

    describe('#([json-encrypted-field])', function() {
    });

    describe('#([full-encrypted-to-raw])', function() {
    });

    describe('#([full-encrypted-to-raw,raw-json-to-json])', function() {
        var rawData = '{"a": "string", "c": 2}';
        var jsonData = JSON.parse(rawData);

        it('should return an Error because of a key mismatch', function() {
            var filter1 = new JsonEncryptedFullFilter({crypt: "aes", key: "123"});
            var filter2 = new DataToJsonFilter();
            var Combined = new FilterData([filter1, filter2]);

            var cryptedRawData = cryptInput(rawData, "456", "aes");

            return assert.isRejected(Combined.filterData(cryptedRawData));
        });

        it('should return the JSON version of the string JSON input', function() {
            var filter1 = new JsonEncryptedFullFilter({crypt: "aes", key: "123"});
            var filter2 = new DataToJsonFilter();
            var Combined = new FilterData([filter1, filter2]);

            var cryptedRawData = cryptInput(rawData, "123", "aes");

            return assert.eventually.deepEqual(Combined.filterData(cryptedRawData), jsonData);
        });
    });

    describe('#([raw-json-to-json,json-encrypted-field])', function() {
        var jsonEncData = {a: cryptFieldInput("string", "123", "aes"), c: 2};
        var rawData = JSON.stringify(jsonEncData);
        var jsonData = {a: "string", c: 2};

        it('should return an Error because of wrong stringified JSON', function() {
            var filter2 = new JsonEncryptedFieldsFilter({crypt: "aes", key: "123", fieldSelection: "enc"});
            var filter1 = new DataToJsonFilter();
            var Combined = new FilterData([filter1, filter2]);

            var brokenRawData = rawData.substr(0, Math.ceil(rawData.length / 2) );

            return assert.isRejected(Combined.filterData(brokenRawData));
        });

        it('should return the JSON version of the string JSON input', function() {
            var filter2 = new JsonEncryptedFieldsFilter({crypt: "aes", key: "123", fieldSelection: "enc"});
            var filter1 = new DataToJsonFilter();
            var Combined = new FilterData([filter1, filter2]);

            return assert.eventually.deepEqual(Combined.filterData(rawData), jsonData);
        });
    });
});