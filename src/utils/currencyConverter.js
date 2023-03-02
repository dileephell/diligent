const axios = require('axios');

const convertCurrency = async (fromCurrency, toCurrency) => {
    try {
        if (fromCurrency === toCurrency) {
            return 1;
        }

        const apiBaseUrl = 'https://api.exchangerate-api.com/v4/latest/';

        const response = await axios.get(apiBaseUrl + fromCurrency);
        const rates = response.data.rates;
        const exchangeRate = rates[toCurrency];

        if (!exchangeRate) {
            throw new Error('Unsupported currency conversion');
        }

        return exchangeRate;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to convert currency');
    }
};
