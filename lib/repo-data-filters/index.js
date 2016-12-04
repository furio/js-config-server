var Promise = require("bluebird");
var debugLog = require('debug')('js-config-server:lib-repo-data-filters');
var FilterData = require("./filter");

var fakeFilter = {
    filterData: function(rawData) {
        return Promise.reject(new Error("No filter selected"))
    }
}

// TODO: review as make filter chainable (if one fail the next is in)
module.exports = function(repoType, options) {
    var defaultFilter = fakeFilter;

    try {
        var FilterImpl = require("./" + repoType);
        defaultFilter = new FilterData( new FilterImpl(options) );
    } catch(ex) {
        debugLog(ex);
    }

    return defaultFilter;
};