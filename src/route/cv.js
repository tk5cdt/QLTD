const express = require('express')
const cvController = require('../controller/cvControllers');
const router = express.Router();
const { upload } = require('../middleware/multer');


const initCVRoute = (app) => {
    router.get('/getFormApply/:id', cvController.getFormApply);
    router.post('/postFormApply/:id', upload.single('resume'), cvController.postFormApply);
    router.get('/list/:id', cvController.getListApplication);
    router.get('/download/:id', cvController.downloadCV);
    
    return app.use('/cv', router);
}

module.exports = initCVRoute;