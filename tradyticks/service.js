require('dotenv').config({path:".env"})
const axios = require('axios');
const priceActionUrl = 'https://tradytics.com/get_tradyflow_price_action_data';
const srLinesUrl = 'https://tradytics.com/get_sr_lines';

const fetchPriceActions = (ticker, period, value) => {
    var cookie = process.env.TRADYTICKS_COOKIE;
    return axios({
        method: 'post',
        url: priceActionUrl,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
         },
        data: 'symbol=' + ticker + '&period=' + period + '&value=' + value
      });
};

const getSrLines = (data) => {
    var cookie = process.env.TRADYTICKS_COOKIE;
    return axios({
        method: 'post',
        url: srLinesUrl,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
         },
        data: 'close=' + JSON.stringify(data)
      });
}

module.exports = {
    fetchPriceActions,
    getSrLines
}