const mongoose = require('mongoose');
// otp token verification schema
const tokenotpScheama = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tokenotp', tokenotpScheama);