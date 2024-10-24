const express = require('express')
const apiController = require('../controller/apiControllers')
const job = require('../controller/jobControllers')
const emp = require('../controller/empControllers')
const router = express.Router();

const initApiRoute = (app) => {
    router.get('/getFormCreateJob', job.getFormCreateJob);
    router.post('/create', job.create);
    router.get('/getjob', job.getJob);
    router.get('/getformupdate/:id', job.getFormUpdate);
    router.post('/updatejob/:id', job.updateJob);
    router.delete('/deletejob/:id', job.deleteJob);
    router.get('/getjobbyfilter', job.getJobByFilter);
    router.get('/getjobrelated', job.getJobRelated);

    router.get('/getFormLogin', emp.getFormLogin);
    router.post('/login', emp.login);
    router.get('/logout', emp.logout);

    return app.use('/job', router);
}

module.exports = initApiRoute;