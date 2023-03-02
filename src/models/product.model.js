const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'CAD', 'EUR', 'GBP'],
        default: 'USD'
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Product', ProductSchema);
