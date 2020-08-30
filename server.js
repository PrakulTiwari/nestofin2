const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
// Config dotev
//hyvyvgvghvgtfv
//erszfce
//"dev":"cocurrently \"npm run backend\" \"npm run start"
//yhyjhh
require('dotenv').config({
    path: './config/config.env'
})


const app = express()

// Connect to database
connectDB();

// body parser
app.use(bodyParser.json())
// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client-reacts/build'))
    // app.use(express.cookieParser('your secret here!'))
//    app.use(express.session())
//     app.use(require('express-session')) 
}
//sdvsectfg
// Use Routes
app.use('/api', authRouter)
app.use('/api', userRouter)


//ijchadbscvbefsjvhcbrf
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});