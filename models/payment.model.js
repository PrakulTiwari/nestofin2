const mongoose = require('mongoose');
const crypto = require('crypto');
// payment schema
const paymentScheama = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    contact: {
        type: String
    },
    payment_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    method: {
        type: String
    },
    status: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentScheama);