var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;
var rewire = require("rewire");
var Promise = require("bluebird");

var LocalRepositoryData = rewire("../../../../lib/repo-data-reader/local-fs/index");

var JsonReadResult = {key: "value"};
var fakeFs = {
    F_OK: 0,
    realpath: function(path, options, cb) {
        if (path.indexOf("TEST_GOOD") !== -1) {
            return cb(null, path);
        }

        return require("fs").realpath(path, options, cb);
    },
    realpathSync: function(path, options) {
        if (path.indexOf("TEST_GOOD") !== -1) {
            return path;
        }

        return require("fs").realpathSync(path);
    },
    readFile: function(path, options, cb) {
        if ((path.indexOf("TESTAPP") !== -1) && (path.indexOf("PROD") !== -1) ) {
            return cb(null, JSON.stringify(JsonReadResult));
        } else {
            return cb(new Error("Failed reading: " + path));
        }
    },
    access: function(path, mode, cb) {
        if (path.indexOf("TEST_GOOD") !== -1) {
            return cb();
        } else {
            return cb(new Error("Failed reading: " + path));
        }
    }
};

LocalRepositoryData.__set__({
    fs: fakeFs,
    access: Promise.promisify(fakeFs.access),
    readFile: Promise.promisify(fakeFs.readFile),
    realPath: Promise.promisify(fakeFs.realpath),
});

describe('LocalRepositoryData', function() {

    describe('#({baseUri: ""})', function () {
        it('should return an Error because of invalid baseUri', function () {
            assert.throws(function() { new LocalRepositoryData({}); }, Error);
        });
    });

    describe('#({baseUri: "/tmp/TEST_GOOD"})', function () {
        it('should return a LocalRepositoryData with proper base uri', function () {
            var repoData = new LocalRepositoryData({baseUri: "/tmp/TEST_GOOD"});
            assert.equal(repoData.baseUri, "/tmp/TEST_GOOD");
        });

        it('should return a resolved promise for isAvailable()', function () {
            var repoData = new LocalRepositoryData({baseUri: "/tmp/TEST_GOOD"});
            return assert.isFulfilled(repoData.isAvailable());
        });

        it('should return JsonReadResult when calling getConfigData("TESTAPP","PROD")', function () {
            var repoData = new LocalRepositoryData({baseUri: "/tmp/TEST_GOOD"});
            return assert.eventually.equal(repoData.getConfigData("TESTAPP","PROD"), JSON.stringify(JsonReadResult));
        });

        it('should return a rejected Promise when calling getConfigData("TESTAPP","DEV")', function () {
            var repoData = new LocalRepositoryData({baseUri: "/tmp/TEST_GOOD"});
            return assert.isRejected(repoData.getConfigData("TESTAPP","DEV"));
        });
    });
});