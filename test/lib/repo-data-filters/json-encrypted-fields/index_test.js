var assert = require('assert');
var CryptoJS = require("crypto-js");
var JsonEncryptedFieldsFilter = require('../../../../lib/repo-data-filters/json-encrypted-fields/index');

describe('JsonEncryptedFieldsFilter({})', function() {
    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {};
            assert.deepEqual(jsonData, Filter.filterData(jsonData));
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {a: "b", c: 2};
            assert.deepEqual(jsonData, Filter.filterData(jsonData));
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {data:"string", object:{data:"string", arr:[{a:{b:{c:1}}}, 2, "data", {}]}};
            assert.deepEqual(jsonData, Filter.filterData(jsonData));
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "aes", key: "123"})', function() {
    var aesKey = "123";
    var jsonFilterOptions = {crypt: "aes", key: aesKey};
    var cryptInput = function(input) {
        return CryptoJS.AES.encrypt(input, aesKey).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};
            assert.deepEqual(jsonData, Filter.filterData(jsonData));
        });

        it('should return the same flat JSON as input', function() {

            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: "2"};
            var encJsonData = {a: cryptInput("string"), c: cryptInput("2")};
            assert.deepEqual(jsonData, Filter.filterData(encJsonData));
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: "1"}}}, "2", "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: cryptInput("1")}}}, cryptInput("2"), cryptInput("data"), {}]}};
            assert.deepEqual(jsonData, Filter.filterData(encJsonData));
        });
    });
});