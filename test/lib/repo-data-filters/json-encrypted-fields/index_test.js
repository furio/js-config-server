var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var CryptoJS = require("crypto-js");
var JsonEncryptedFieldsFilter = require('../../../../lib/repo-data-filters/json-encrypted-fields/index');

describe('JsonEncryptedFieldsFilter({})', function() {
    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {a: "b", c: 2};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {data:"string", object:{data:"string", arr:[{a:{b:{c:1}}}, 2, "data", {}]}};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "aes", key: "123"})', function() {
    var jsonFilterOptions = {crypt: "aes", key: "123"};

    var cryptInput = function(input) {
        return CryptoJS.AES.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: "2"};
            var encJsonData = {a: cryptInput("string"), c: cryptInput("2")};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: "1"}}}, "2", "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: cryptInput("1")}}}, cryptInput("2"), cryptInput("data"), {}]}};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "aes", key: "456", fieldSelection: "enc"})', function() {
    var jsonFilterOptions = {crypt: "aes", key: "456", fieldSelection: "enc"};

    var cryptInput = function(input) {
        return "<enc>" + CryptoJS.AES.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: 2};
            var encJsonData = {a: cryptInput("string"), c: 2};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: 1}}}, 2, "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: 1}}}, 2, cryptInput("data"), {}]}};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "rabbit", key: "123"})', function() {
    var jsonFilterOptions = {crypt: "rabbit", key: "123"};

    var cryptInput = function(input) {
        return CryptoJS.Rabbit.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: "2"};
            var encJsonData = {a: cryptInput("string"), c: cryptInput("2")};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: "1"}}}, "2", "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: cryptInput("1")}}}, cryptInput("2"), cryptInput("data"), {}]}};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "rabbit", key: "456", fieldSelection: "enc"})', function() {
    var jsonFilterOptions = {crypt: "rabbit", key: "456", fieldSelection: "enc"};
    var cryptInput = function(input) {
        return "<enc>" + CryptoJS.Rabbit.encrypt(input, jsonFilterOptions.key).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            assert.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: 2};
            var encJsonData = {a: cryptInput("string"), c: 2};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: 1}}}, 2, "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: 1}}}, 2, cryptInput("data"), {}]}};

            assert.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});