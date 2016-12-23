var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var DataToJsonFilter = require('../../../../lib/repo-data-filters/raw-json-to-json');

describe('RawJsonToJsonFilter({})', function() {
    describe('#filterData()', function() {
        it('should return error with empty string', function() {
            var Filter = new DataToJsonFilter({});
            var jsonData = "";

            assert.throws(function () { Filter.filterData(jsonData); }, Error);
        });

        it('should return a JSON parsed over the input string', function() {
            var Filter = new DataToJsonFilter({});
            var jsonData = '{"a": "b", "c": 2}';
            var jsonParsed = {a: 'b', c: 2};

            assert.deepEqual(Filter.filterData(jsonData), jsonParsed);
        });
    });
});