const mongoose = require('mongoose');
// service schema
const beneficiaryScheama = new mongoose.Schema({
    beneId: {
        type: String,
        required: true,
        maxlength: 50
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String
    },
    ifsc: {
        type: String
    },
    vpa: {
        type: String
    },
    cardNo: {
        type: String,
        maxlength: 16
    },
    address1: {
        type: String,
        required: true,
        maxlength: 150
    },
    city: {
        type: String,
        maxlength: 50
    },
    state: {
        type: String,
        maxlength: 50
    },
    pincode: {
        type: String,
        maxlength: 6
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Beneficiary', beneficiaryScheama);