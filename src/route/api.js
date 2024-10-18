const express = require('express')
const apiController = require('../controller/apiControllers')
const job = require('../controller/jobControllers')
const router = express.Router();

const initApiRoute = (app) => {
    router.get('/getFormCreateJob', job.getFormCreateJob);
    router.post('/create', job.create);
    router.get('/getjob', job.getJob);
    router.put('/updatejob/:id', job.updateJob);
    router.delete('/deletejob/:id', job.deleteJob);
    router.post('/getjobbyname', job.getJobByName);
    router.post('/getjobbylocation', job.getJobByLocation);

    return app.use('/api', router);
}

module.exports = initApiRoute;