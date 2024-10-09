const express = require('express')
const apiController = require('../controller/apiControllers')

const router = express.Router();

const initApiRoute = (app) => {
    router.get('/gettest', apiController.getTest);

    return app.use('/api', router);
}

module.exports = initApiRoute;