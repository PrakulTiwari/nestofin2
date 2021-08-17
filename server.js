const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const cors = require('cors')
const path = require('path')
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})

const app = express()
app.use(express.static('public'));
app.set('view engine', 'ejs')
// Connect to database
const connectDB = require('./config/db')
// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }));
    app.use(morgan('dev'))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('client-reacts', 'build')))
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))

    app.use(morgan('tiny'))
    // app.get("/",(req,res)=>{
    //     res.sendFile(path.join('client-reacts','build','index.html'))
    // })
    // app.get("/*",(req,res)=>{
    //     res.sendFile(path.join('client-reacts','build','index.html'))
    // })
    // app.get("*", (req, res) => {
    //     res.sendFile(path.join('client-reacts', 'build', 'index.html'))
    // })
}

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
// Use Routes
app.use('/api', authRouter)

app.use('/api', userRouter)



connectDB().then(
    () => {
        console.log('Database Connected');
    },
    err => {
        console.log(`Database connection error: ${err}`)
    }
);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });