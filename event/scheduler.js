require('dotenv').config({path:".env"})
const cron = require('node-cron');
const db = require('../database/models/index');
const eventEmitter = require('./event-manager');

const getScheduleString = () => {
    switch(process.env.TICKER_DATA_UPDATE_PERIOD) {
        case 'M':
            return process.env.TICKER_DATA_UPDATE_VALUE + ' * * * *';
        default :
            return '0' + process.env.TICKER_DATA_UPDATE_VALUE + ' * * *';
    }
};

const schedule = () => {
    const scheduleStr = getScheduleString();
    console.log('scheduling the task with: ' + scheduleStr);
    cron.schedule(scheduleStr, () => {
        console.log("running scheduled task at: " + new Date());
        updatePriceActionAndSrLevels();
    });
};

const updatePriceActionAndSrLevels = () => {
    console.log('updating price action and sr levels for active trade tickers');
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
        console.log('list of active trade tickers: ' + JSON.stringify(values));
        values = values.reduce((a,b) => a.concat(b), []);

        values.forEach(value => {
            if (value['ticker']) {
                console.log('emitting update_ticker_details event for: ' + value);
                eventEmitter.emitEvent('update_ticker_details', value);
            }
        });
    }).catch(err => console.log('error occurred while updating ticker data: ' + err));
};

module.exports = {
    schedule
}
