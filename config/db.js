const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .catch(err => console.log(`${err}`));

    console.log(`MongoDB Connected: ${connection.connection.host}`);
}; 

module.exports = connectDB;