const Product = require('../models/product.model');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const fetch = require('node-fetch');
const { convertCurrency } = require('../utils/currencyConverter');
require('dotenv').config();
const DEFAULT_NUM_PRODUCTS = 5;
const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP'];

// Function for creating a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = new Product({ name, price, description,viewCount:0 });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get the exchange rate for the specified currency
async function getExchangeRate(currency) {
    const supportedCurrencies = ['USD', 'CAD', 'EUR', 'GBP'];
    const url = `https://api.apilayer.com/currency_data/live?access_key=${process.env.CURRENCY_API_KEY}&currencies=${currency}`;

    if (!supportedCurrencies.includes(currency)) {
        throw new Error(`Unsupported currency: ${currency}`);
    }

    const myHeaders = new fetch.Headers();
    myHeaders.append("apikey", "h0yR6vmBiwjJaOVXGamjeVMtZzlETW73");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("accept", "application/json");
    myHeaders.append('X-Requested-With', 'XMLHttpRequest');

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const data = await response.json();
            if (!data.quotes || !data.quotes[`USD${currency}`]) {
                throw new Error(`Unsupported currency: ${currency}`);
            }
            return data.quotes[`USD${currency}`];
        } else {
            throw new Error(`Unable to retrieve exchange rates: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Unable to retrieve exchange rates');
    }
}


exports.getMostViewedProducts = async (req, res) => {
    try {
        const numProducts = req.query.numProducts || DEFAULT_NUM_PRODUCTS;
        const currency = req.query.currency;

        if (currency && !SUPPORTED_CURRENCIES.includes(currency)) {
            return res.status(400).json({ message: 'Unsupported currency' });
        }

        const mostViewedProducts = await Product.find()
            .where({ viewCount: { $gt: 0 } })
            .sort({ viewCount: 'desc' })
            .limit(parseInt(numProducts))
            .exec();

        const formattedProducts = await Promise.all(
            mostViewedProducts.map(async (product) => {
                const formattedProduct = product.toObject();

                if (currency) {
                    const exchangeRate = await convertCurrency(product.price_currency, currency);
                    formattedProduct.price = product.price * exchangeRate;
                    formattedProduct.price_currency = currency;
                }

                return formattedProduct;
            })
        );

        return res.status(200).json(formattedProducts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function for getting a single product by ID
exports.getProduct = async (req, res) => {
    try {
        // Get the product id from the request params
        const productId = req.params.productId;
        if (productId === 'most-viewed') {
            return exports.getMostViewedProducts(req, res);
        }
        const product = await Product.findById(productId);

        // If product not found, send 404 error response
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Increment the view count of the product
        product.viewCount += 1;
        await product.save();

        // Get the requested currency from the request query params
        const currency = req.query.currency;

        // If currency is specified, convert the price
        if (currency) {
            // Get the exchange rate for the specified currency
            const exchangeRate = await getExchangeRate(currency);

            // Calculate the converted price
            const convertedPrice = product.price * exchangeRate;

            // Construct the response object with the converted price
            const response = {
                id: product._id,
                name: product.name,
                description: product.description,
                price: convertedPrice.toFixed(2),
                currency: currency,
                viewCount: product.viewCount,
            };
            // Send the response object
            return res.status(200).json(response);
        }

        // If currency is not specified, send the product object
        const formattedProduct = product.toObject();

        return res.status(200).json(formattedProduct);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for deleting a product by ID

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Find the product by ID and delete it from the database
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
