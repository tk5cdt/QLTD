const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const initApiRoutes = require('./route/api')
const initCVRoute = require('./route/cv')
const configViewEngine = require('./configs/viewEngine')
const connectDB = require('./configs/connectDB')
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const app = express()
const mongoose = require('mongoose');
const { init } = require('express/lib/application')

//config to use req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '/' }));
app.use(express.json());
app.use(morgan('dev'));

console.log('MONGODB_URI:', process.env.MONGO_URI);

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

configViewEngine(app)

initApiRoutes(app)
initCVRoute(app)

app.get('/', (req, res) => {
    res.json({
        message: 'Server running at ' + PORT
    })
})

app.listen(PORT, () => {
    console.log('Server running at ' + PORT);
})

connectDB().catch(console.dir);