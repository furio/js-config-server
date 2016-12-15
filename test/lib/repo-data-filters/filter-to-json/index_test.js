var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var DataToJsonFilter = require('../../../../lib/repo-data-filters/filter-to-json/index');

describe('DataToJsonFilter({})', function() {
    describe('#filterData()', function() {
        it('should return error with empty string', function() {
            var Filter = new DataToJsonFilter({});
            var jsonData = "";

            return assert.isRejected(Filter.filterData(jsonData));
        });

        it('should return a JSON parsed over the input string', function() {
            var Filter = new DataToJsonFilter({});
            var jsonData = '{"a": "b", "c": 2}';
            var jsonParsed = {a: 'b', c: 2};

            return assert.eventually.deepEqual(Filter.filterData(jsonData), jsonParsed);
        });
    });
});