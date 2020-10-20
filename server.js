const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const cors = require('cors')
const Service = require('./models/services.model')
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})

const app = express()
//socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)
exports.io = io;
// Connect to database
const connectDB = require('./config/db')
// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
    app.use(morgan('dev'))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('client-reacts', 'build')))
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))

    app.use(morgan('tiny'))

    // app.get('*', (req, res) => {
    //     res.redirect(req.url())
    // })
    // app.get("/",(req,res)=>{
    //     res.sendFile(path.join('client-reacts','build','index.html'))
    // })
    // app.get("/*",(req,res)=>{
    //     res.sendFile(path.join('client-reacts','build','index.html'))
    // })
    // app.get("*",(req,res)=>{
    //     res.sendFile(path.join('client-reacts','build','index.html'))
    // })

    // app.use(express.cookieParser('your secret here!'))
    //    app.use(express.session())
    //     app.use(require('express-session')) 
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
io.on('connection', socket => {
    Service.findOne({ productName: 'YOLK' }, (err, yolk) => {
        if (err) {
            console.log('Check if DATABASE is connected')
        } else if (!yolk) {
            const newyolk = new Service({
                productName: 'YOLK',
                count: 25,
            })
            newyolk.save((err, nyolk) => {
                if (err) {
                    console.log('YOLKS not ready');
                } else {
                    io.emit('updateYolk', { count: nyolk.count });
                    console.log('Ready to sell YOLKS');
                }
            });
        } else {
            console.log('Ready to sell YOLKS');
            io.emit('updateYolk', { count: yolk.count });
        }
    });
    console.log('New User Connected')

});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

http.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });