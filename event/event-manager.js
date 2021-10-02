const tradyService = require('../tradyticks/service');
const db = require('../database/models/index');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('ticker_saved', (data) => {
    emitEvent('update_ticker_details', data);
});

eventEmitter.on('update_ticker_details', (data) => {
    removeExistingPriceActions(data.ticker).then(()=> {
        fetchPriceAction(data.ticker, 'minute', 15);
        fetchPriceAction(data.ticker, 'minute', 30);
        fetchPriceAction(data.ticker, 'day', 1);
    }).catch(err => console.log('error occurred while processing ticker saved event: ' + err));
});

eventEmitter.on('price_action_saved', (data) => {
    removeExistingSrLevel(data.ticker, data.period).then(() => {
        saveSrLevels(data);
    }).catch(err => console.log('error occurred while process price action saved event: ' + err));
});

const emitEvent = (eventName, data) => {
    eventEmitter.emit(eventName, data);
};

const removeExistingPriceActions = (ticker) => {
    return db['PriceAction'].destroy({where: {ticker:ticker}}).then(() => {
        console.log('deleted price action objects with ticker: ' + ticker);
    });   
};

const removeExistingSrLevel = (ticker, period) => {
    return db['SrLevels'].destroy({where: {ticker: ticker, period: period}}).then(() => {
        console.log('deleted sr levels for ticker: ' + ticker);
    })
};

const fetchPriceAction = (ticker, period, value) => {
    tradyService.fetchPriceActions(ticker, period, value)
        .then(response => {
            console.log('received price action data: ' + response.data);
            persistPriceAction(ticker, period == 'minute' 
                ? 'INTRA_' + value : 'DAILY', JSON.stringify(response.data.data));

            // emit price action saved event
            emitEvent('price_action_saved', {
                ticker: ticker,
                period: period == 'minute' ? 'INTRA_' + value : 'DAILY',
                priceAction: response.data.data
            });
        }).catch(err => console.log('error occurred while fetching price action: ' + err));
};

const saveSrLevels = (data) => {
    const closePrices = data.priceAction.map(p => p.close);
    tradyService.getSrLines(closePrices)
        .then(response => {
            var srLevels = {};
            srLevels.ticker = data.ticker;
            srLevels.period = data.period;
            srLevels.levels = JSON.stringify(response.data.data.sort());
            db['SrLevels'].create(srLevels).then(object => {
                console.log('SrLevels instance stored with id: ' + object.id);
            })
        }).catch(err => console.log('error occurred while fetching sr levels: ' + err));
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