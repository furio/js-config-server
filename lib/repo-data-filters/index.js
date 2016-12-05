var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-filters');
var FilterData = require("./filter");

var fakeFilter = {
    filterData: function(rawData) {
        return Promise.reject(new Error("No filter selected"));
    }
};

module.exports = function(options) {
    var defaultFilter = fakeFilter;

    try {
        var FilterImplChain = options.map(function(el) {
            var FilterImpl = require("./" + el.type);
            return new FilterImpl(el.options || {});
        });

        defaultFilter = new FilterData( FilterImplChain );
    } catch(ex) {
        debugLog(ex);
    }

    return defaultFilter;
};