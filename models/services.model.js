const mongoose = require('mongoose');
// service schema
const serviceScheama = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        minimum: 0,
        multipleOf: 1
    },
    available: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('service', serviceScheama);