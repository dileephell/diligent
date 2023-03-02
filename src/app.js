const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/diligent', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

module.exports = app;
