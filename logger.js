const log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    //app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'debug' }
  }
});

module.exports.log4js = log4js;