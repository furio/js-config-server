var express = require('express');
var path = require('path');
var LOG = require('./logger.js');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var configData = require("./lib/config");
var indexRoute = require('./routes/index');
var configsRoute = require('./routes/appConfigs')(configData);

app.use(morgan((app.get('env') !== 'production') ? 'dev' : 'combined', { stream: LOG.morganStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require("./lib/config-middleware")(configData));


app.use('/', indexRoute);
app.use('/configs', configsRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') !== 'production') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });
}


module.exports = app;
