import express from 'express'
import session from 'express-session'
import initApiRoutes from './route/api'
import configViewEngine from './configs/viewEngine'

require('dotenv').config();
let port = process.env.PORT || 8080;

const app = express()

//config to use req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '/' }));
app.use(express.json());

//config session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//config view engine
configViewEngine(app)

initApiRoutes(app)

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port: " + port);
})