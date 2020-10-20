const mongoose = require('mongoose');
//mongodb://heroku_b0jmp3bz:in4mev1iq46vqo2bo45e5pkicl@ds033046.mlab.com:33046/heroku_b0jmp3bz
const connectDB = async () => {
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

};

module.exports = connectDB;