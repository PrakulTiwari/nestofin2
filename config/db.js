const mongoose = require('mongoose');
//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

const connectDB = async () => {
    return mongoose.connect('mongodb://localhost:27017/nestofin', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDB;


//process.env.MONGO_URI