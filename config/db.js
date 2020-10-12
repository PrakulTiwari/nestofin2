const mongoose = require('mongoose');
//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

const connectDB = async () => {
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
};

module.exports = connectDB;


//process.env.MONGO_URI