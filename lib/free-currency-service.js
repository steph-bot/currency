require('dotenv').config();
const axios = require('axios');

const access_key = process.env.API_KEY_CURRENCY;

const api = axios.create({
    // baseURL: 'https://free.currencyconverterapi.com/api/v5',
    baseURL: 'https://free.currconv.com/api/v7',
    timeout: 5000,
});

/*
Example usage:
https://free.currconv.com/api/v7/convert?q=USD_PHP&compact=ultra&apiKey=dced6d990f95e7b44f96
*/

module.exports = {
    convertCurrency: async (from, to) => {
        // const response = await api.get(`/convert?q=${from}_${to}&compact=y`);
        const response = await api.get(`/convert?q=${from}_${to}&compact=ultra&apiKey=${access_key}`);
        const key = Object.keys(response.data)[0];
        // const { val } = response.data[key];
        const val = response.data[key];
        return { rate: val };
    },
};