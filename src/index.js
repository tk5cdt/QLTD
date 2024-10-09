const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const initApiRoutes = require('./route/api')
const configViewEngine = require('./configs/viewEngine')
const connectDB = require('./configs/connectDB')
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const app = express()
const mongoose = require('mongoose');

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

app.get('/', (req, res) => {
    response.json({
        message: 'Server running at ' + PORT
    })
})

connectDB().catch(console.dir);

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((error) => {
//     console.log('Error connecting to MongoDB:', error);
// });