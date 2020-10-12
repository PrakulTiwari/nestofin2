const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
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
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('client-reacts', 'build')))
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))

    app.use(morgan('tiny'))

    app.get('*', (req, res) => {
        res.redirect('/')
    })

    // app.get('*', (req, res) => {
    //     console.log(req.url)
    //     res.redirect('http://' + req.headers.host + req.url)
    // })


    // app.get("/", (req, res) => {
    //     res.sendFile(path.join('client-reacts', 'build', 'index.html'))
    // })
    // // app.get("/*",(req,res)=>{
    // //     res.sendFile(path.join('client-reacts','build','index.html'))
    // // })
    // app.get("*", (req, res) => {
    //     res.sendFile(path.join('client-reacts', 'build', 'index.html'))
    // })

    // app.use(express.cookieParser('your secret here!'))
    //    app.use(express.session())
    //     app.use(require('express-session')) 
}


// body parser
app.use(bodyParser.json())

// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
// Use Routes
app.use('/api', authRouter)

app.use('/api', userRouter)



io.on('connection', socket => {

    console.log('New User Connected')
    connectDB().then(
        () => {
            console.log('Database Connected');
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
                            // io.on('connection', socket => {
                            //     console.log('User Connected')
                            io.emit('updateYolk', { count: nyolk.count });
                            // })
                            console.log('Ready to sell YOLKS');
                        }
                    });
                } else {
                    console.log('Ready to sell YOLKS');

                    // io.on('connection', socket => {
                    //     console.log('User Connected');
                    io.emit('updateYolk', { count: yolk.count });
                    // })
                }
            });
        },
        err => {
            console.log(`Database connection error: ${err}`)
        }
    );

});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

http.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });





//////////////////////////////////////////////////////////

// const express = require('express')
// const morgan = require('morgan')
// const connectDB = require('./config/db')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const path = require('path')
// // Config dotev


// require('dotenv').config({
//     path: './config/config.env'
// })


// const app = express()

// // "functions": {
// //     "predeploy":  [
// //       "cd client-reacts && npm run build",
// //       "cd client-reacts && npm install",
// //       "node server.js",
// //       "cd client-reacts && npm start"
// //     ]
// //   }

// // Connect to database
// //hrlll
// //hell
// connectDB();

// // body parser
// app.use(bodyParser.json())
// // Load routes
// const authRouter = require('./routes/auth.route')
// const userRouter = require('./routes/user.route')
// //mongodb://heroku_b0jmp3bz:in4mev1iq46vqo2bo45e5pkicl@ds033046.mlab.com:33046/heroku_b0jmp3bz

// //sg pass :jt991s539944

// //app182679152@heroku.com

// // Dev Logginf Middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(cors({
//         origin: process.env.CLIENT_URL
//     }))
//     app.use(morgan('dev'))
// }
// else if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join('client-reacts', 'build')))
//     app.use(cors({
//         origin: process.env.CLIENT_URL
//     }))

//     app.use(morgan('tiny'))

//     app.get('*', (req, res) => {
//         res.redirect('/')
//     })

//     // app.get('*', (req, res) => {
//     //     console.log(req.url)
//     //     res.redirect('http://' + req.headers.host + req.url)
//     // })


//     // app.get("/", (req, res) => {
//     //     res.sendFile(path.join('client-reacts', 'build', 'index.html'))
//     // })
//     // // app.get("/*",(req,res)=>{
//     // //     res.sendFile(path.join('client-reacts','build','index.html'))
//     // // })
//     // app.get("*", (req, res) => {
//     //     res.sendFile(path.join('client-reacts', 'build', 'index.html'))
//     // })

//     // app.use(express.cookieParser('your secret here!'))
//     //    app.use(express.session())
//     //     app.use(require('express-session')) 
// }

// // Use Routes
// app.use('/api', authRouter)
// app.use('/api', userRouter)


// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         msg: "Page not founded"
//     })
// })

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });