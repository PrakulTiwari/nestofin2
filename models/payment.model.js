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
    referenceId: {
        type: String
    },
    orderId: {
        type: String,
        required: true
    },
    paymentMode: {
        type: String
    },
    txStatus: {
        type: String
    },
    amount: {
        type: Number,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentScheama);