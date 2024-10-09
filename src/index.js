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

connectDB().then(() => {
    app.listen(8080, () => {
        console.log('Server running at ' + 8080);
    })
})

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     age: Number
// });

// const User = mongoose.model('User', userSchema);

// async function createSampleData() {
//     await User.create([
//         { name: 'Alice', email: 'alice@example.com', age: 25 },
//         { name: 'Bob', email: 'bob@example.com', age: 30 },
//         { name: 'Charlie', email: 'charlie@example.com', age: 35 }
//     ]);
//     console.log('Sample data created');
// }

// createSampleData();

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((error) => {
//     console.log('Error connecting to MongoDB:', error);
// });