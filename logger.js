var winston = require('winston');

var logger = module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'verbose',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        }),
        new (winston.transports.File)({
            filename: 'log/filelogging.log',
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: false,
            timestamp: true
        })
    ]
});

logger.morganStream = {
    write: function(message, encoding){
        logger.info(message);
    }
};