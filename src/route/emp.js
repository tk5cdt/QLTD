const express = require('express');
const emp = require('../controller/empControllers');
const router = express.Router();

const initEmpRoute = (app) => {
    router.get('/getFormLogin', emp.getFormLogin);
    router.post('/login', emp.login);
    router.get('/logout', emp.logout);
    router.get('/getjobforemp', emp.getJobForEmp);
    router.get('/getjobbyfilterforemp', emp.getJobByFilterForEmp);

    return app.use('/emp', router);
}

module.exports = initEmpRoute;