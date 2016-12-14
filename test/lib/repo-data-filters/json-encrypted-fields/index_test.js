var assert = require('assert');
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