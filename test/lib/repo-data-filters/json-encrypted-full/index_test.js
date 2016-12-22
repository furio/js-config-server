var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var CryptoJS = require("crypto-js");
var JsonEncryptedFullFilter = require('../../../../lib/repo-data-filters/json-encrypted-full/index');

describe('JsonEncryptedFullFilter({})', function() {
    describe('#filterData()', function() {
        it('should return the empty JSON string as input', function() {
            var Filter = new JsonEncryptedFullFilter({});
            var rawData = '{}';

            assert.deepEqual(Filter.filterData(rawData), rawData);
        });

        it('should return the same JSON string as input', function() {
            var Filter = new JsonEncryptedFullFilter({});
            var rawData = '{a: "b", c: 2}';

            assert.deepEqual(Filter.filterData(rawData), rawData);
        });
    });
});

describe('JsonEncryptedFullFilter({crypt: "aes", key: "123"})', function() {
    var jsonFilterOptions = {crypt: "aes", key: "123"};
    var cryptInput = function(input) {
        return CryptoJS.AES.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON string as input', function() {
            var Filter = new JsonEncryptedFullFilter(jsonFilterOptions);
            var rawData = '{}';

            assert.deepEqual(Filter.filterData(cryptInput(rawData)), rawData);
        });

        it('should return the same JSON string as input', function() {
            var Filter = new JsonEncryptedFullFilter(jsonFilterOptions);
            var rawData = '{a: "string", c: 2}';

            assert.deepEqual(Filter.filterData(cryptInput(rawData)), rawData);
        });
    });
});

describe('JsonEncryptedFullFilter({crypt: "rabbit", key: "123"})', function() {
    var jsonFilterOptions = {crypt: "rabbit", key: "123"};

    var cryptInput = function(input) {
        return CryptoJS.Rabbit.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFullFilter(jsonFilterOptions);
            var rawData = '{}';

            assert.deepEqual(Filter.filterData(cryptInput(rawData)), rawData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFullFilter(jsonFilterOptions);
            var rawData = '{a: "string", c: 2}';

            assert.deepEqual(Filter.filterData(cryptInput(rawData)), rawData);
        });
    });
});