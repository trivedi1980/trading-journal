const tradyService = require('../tradyticks/service');
const db = require('../database/models/index');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('ticker_saved', (data) => {
    fetchPriceAction(data.ticker, 'minute', 15);
    fetchPriceAction(data.ticker, 'minute', 30);
    fetchPriceAction(data.ticker, 'day', 1);
});

const emitEvent = (eventName, data) => {
    eventEmitter.emit(eventName, data);
};

const fetchPriceAction = (ticker, period, value) => {
    tradyService.fetchPriceActions(ticker, period, value)
        .then(response => {
            console.log('received price action data: ' + response.data);
            persistPriceAction(ticker, period == 'minute' ? 'INTRA_' + value : 'DAILY', 
                JSON.stringify(response.data.data));
        }).catch(err => console.log('error occurred while fetching price action: ' + err));
};

const persistPriceAction = (ticker, period, jsonData) => {
    var priceAction = {};
    priceAction.ticker = ticker;
    priceAction.period = period;
    priceAction.data = jsonData;

    return db['PriceAction'].create(priceAction).then((object) => {
        console.log('created price action instance: ' + object.id);
    }).catch(err => {
        console.error('error occurred: ' + err);
    });
};

module.exports = {
    emitEvent
}