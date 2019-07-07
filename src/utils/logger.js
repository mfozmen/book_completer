var log4js = require('log4js');

log4js.configure({
    appenders: {
        err: {
            type: 'file',
            filename: 'logs/error.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        },
        inf: {
            type: 'file',
            filename: 'logs/info.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['err'],
            level: 'error'
        },
        error: {
            appenders: ['err'],
            level: 'error'
        },
        info: {
            appenders: ['inf'],
            level: 'info'
        }
    }
});

var errorLog = log4js.getLogger('error');
var infoLog = log4js.getLogger('info');

module.exports = {
    error: function (msg) {
        errorLog.error(msg);
    },
    info: function (msg) {
        infoLog.info(msg);
    }

};