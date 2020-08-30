const mongoose = require('mongoose');
//mongodb://heroku_b0jmp3bz:in4mev1iq46vqo2bo45e5pkicl@ds033046.mlab.com:33046/heroku_b0jmp3bz
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