const express = require('express')
const cvController = require('../controller/cvControllers');
const router = express.Router();

const initCVRoute = (app) => {
    router.get('/getFormApply/:id', cvController.getFormApply);
    router.post('/postFormApply/:id', cvController.postFormApply);
    
    return app.use('/cv', router);
}

module.exports = initCVRoute;