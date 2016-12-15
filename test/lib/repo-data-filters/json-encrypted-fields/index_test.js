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

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {a: "b", c: 2};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter({});
            var jsonData = {data:"string", object:{data:"string", arr:[{a:{b:{c:1}}}, 2, "data", {}]}};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "aes", key: "123"})', function() {
    var cryptKey = "123";
    var jsonFilterOptions = {crypt: "aes", key: cryptKey};
    var aesIV = CryptoJS.PBKDF2(cryptKey, 'all');

    var cryptInput = function(input) {
        return CryptoJS.AES.encrypt(input, cryptKey, { iv: aesIV, mode: CryptoJS.mode.OFB, padding: CryptoJS.pad.NoPadding }).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: "2"};
            var encJsonData = {a: cryptInput("string"), c: cryptInput("2")};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: "1"}}}, "2", "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: cryptInput("1")}}}, cryptInput("2"), cryptInput("data"), {}]}};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "aes", key: "456", fieldSelection: "enc"})', function() {
    var cryptKey = "456";
    var jsonFilterOptions = {crypt: "aes", key: cryptKey, fieldSelection: "enc"};
    var aesIV = CryptoJS.PBKDF2(cryptKey, 'enc');

    var cryptInput = function(input) {
        return "<enc>" + CryptoJS.AES.encrypt(input, cryptKey, { iv: aesIV, mode: CryptoJS.mode.OFB, padding: CryptoJS.pad.NoPadding }).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: 2};
            var encJsonData = {a: cryptInput("string"), c: 2};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: 1}}}, 2, "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: 1}}}, 2, cryptInput("data"), {}]}};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "rabbit", key: "123"})', function() {
    var cryptKey = "123";
    var jsonFilterOptions = {crypt: "rabbit", key: cryptKey};
    var cryptInput = function(input) {
        return CryptoJS.Rabbit.encrypt(input, cryptKey).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: "2"};
            var encJsonData = {a: cryptInput("string"), c: cryptInput("2")};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: "1"}}}, "2", "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: cryptInput("1")}}}, cryptInput("2"), cryptInput("data"), {}]}};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});

describe('JsonEncryptedFieldsFilter({crypt: "rabbit", key: "456", fieldSelection: "enc"})', function() {
    var cryptKey = "456";
    var jsonFilterOptions = {crypt: "rabbit", key: cryptKey, fieldSelection: "enc"};
    var cryptInput = function(input) {
        return "<enc>" + CryptoJS.Rabbit.encrypt(input, cryptKey).toString();
    };

    describe('#filterData()', function() {
        it('should return the empty JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonData);
        });

        it('should return the same flat JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {a: "string", c: 2};
            var encJsonData = {a: cryptInput("string"), c: 2};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });

        it('should return the same JSON as input', function() {
            var Filter = new JsonEncryptedFieldsFilter(jsonFilterOptions);
            var jsonData = {data: "string", object:{data: "string", arr:[{a:{b:{c: 1}}}, 2, "data", {}]}};
            var encJsonData = {data: cryptInput("string"), object:{data: cryptInput("string"), arr:[{a:{b:{c: 1}}}, 2, cryptInput("data"), {}]}};

            return assert.eventually.deepEqual(Filter.filterData(encJsonData), jsonData);
        });
    });
});