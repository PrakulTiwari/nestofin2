const mongoose = require('mongoose');
const crypto = require('crypto');
// payment schema
const paymentScheama = new mongoose.Schema({
    orderId: {
        type: String,
        unique:true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique:false,
        // required: true,
        lowercase: true
    },
    contact: {
        type: String
    },
    referenceId: {
        type: String
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