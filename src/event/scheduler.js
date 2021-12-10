require('dotenv').config({path:".env"});
const logger = require("../logger").log4js.getLogger('event/scheduler');
const cron = require('node-cron');
const db = require('../database/models/index');
const eventEmitter = require('./event-manager');

const getScheduleString = () => {
    switch(process.env.TICKER_DATA_UPDATE_PERIOD) {
        case 'M':
            return process.env.TICKER_DATA_UPDATE_VALUE + ' * * * *';
        default :
            return '0 ' + process.env.TICKER_DATA_UPDATE_VALUE + ' * * *';
    }
};

const schedule = () => {
    const scheduleStr = getScheduleString();
    logger.info('scheduling the task with: ' + scheduleStr);
    cron.schedule(scheduleStr, () => {
        logger.info("running scheduled task at: " + new Date());
        updatePriceActionAndSrLevels();
    });
};

const updatePriceActionAndSrLevels = () => {
    logger.info('updating price action and sr levels for active trade tickers');
    Promise.all([db['CommonsTrade'].findAll({
        where: {
            trade_close_date: null
        },
        attributes: ['ticker']
    }), db['OptionsTrade'].findAll({
        where: {
            trade_close_date: null
        },
        attributes: ['ticker']    
    })]).then(values => {
        logger.info('list of active trade tickers: ' + JSON.stringify(values));
        values = values.reduce((a,b) => a.concat(b), []);

        values.forEach(value => {
            if (value['ticker']) {
                logger.info('emitting update_ticker_details event for: ' + value);
                eventEmitter.emitEvent('update_ticker_details', value);
            }
        });
    }).catch(err => logger.error('error occurred while updating ticker data: ' + err));
};

module.exports = {
    schedule
}
