require('dotenv').config({path:".env"})
const axios = require('axios');
const priceActionUrl = 'https://tradytics.com/get_tradyflow_price_action_data';

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

module.exports = {
    fetchPriceActions
}