import qltd from '../model/QLTuyenDung';
import bcrypt from 'bcrypt';
const {Job} = require('../model/QLTuyenDung')

const getFormLogin = async (req, res) => {
    try {
        return res.render('login', {user: req.session.user, message: "" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the job.");
    }
};

const login = async (req, res) => {
    let {name, password} = req.body;
    if (!name || !password) {
        return res.status(400).render('login', {message: "Username and password are required!" });
    }
    try {
        const user = await qltd.Employees.findOne({ username: name });

        if (!user) {
            return res.status(400).render('login', {user, message: "Username is invalid!" });
        }

        console.log("username db:" , user.username);
        console.log("password db:" , user.password);

        console.log("username:" , name);
        console.log("password:" , password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);

        if (isMatch) {
            req.session.user = user;
            console.log("Session after login:", req.session);
            return res.redirect('/emp/getjobforemp');
        } else {
            return res.status(400).render('login', {user: req.session.user, message: "Password is incorrect!" });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).render('login', {user: req.session.user, message: "Internal server error"});
    }
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/emp/getFormLogin');
}

const getJobForEmp = async (req, res) => {
    const user = req.session.user;
    if(req.query.id)
    {
        const id = req.query.id;
        Job.findById(id).then(data => {
            if (!data) {
                res.status(404).send({message: `Not found Job with id=${id}`});
            } else {
                return res.render('jobdetail', { user: req.session.user, job: data});
            }
        }).catch(err => {
            res.status(500).send({message: err.message || `Error retrieving Job with id=${id}`});
        });
        return;
    }
    else{
        let pagesize = req.query.pagesize || 9;
        let page = req.query.page || 1;
        try {
            const jobsEmp = await qltd.Job.find().skip((page - 1) * pagesize).limit(pagesize);
            const totalJobs = await Job.countDocuments(jobsEmp);
            const totalPages = Math.ceil(totalJobs / pagesize);
            return res.render('listJob', { user: req.session.user, jobsEmp, pagesize, page, totalPages, user});
        }
        catch (error) {
            console.error(error);
            return res.status(500).send("An error occurred while fetching the applications.");
        }
        // Job.find().then(data => {
        //     return res.render('listJob', { jobs: data, message: "" });
        // }).catch(err => {
        //     res.status(500).send({message: err.message || "Some error occurred while retrieving jobs."});
        // });
    }
}

const getJobByFilterForEmp = async (req, res) => {
    let {jobName, location, employmentType} = req.query;
    let filter = {};
    let pagesize = req.query.pagesize || 9;
    let page = req.query.page || 1;
    try {
        if (location && location !== 'Location') {
            filter.location = { $regex: location, $options: 'i' };
        }
        if (employmentType && employmentType !== 'Select types') {
            filter.employmentType = { $regex: employmentType, $options: 'i' };
        }

        if (jobName) {
            filter.jobTitle = { $regex: jobName, $options: 'i' };
        }
        console.log("Filter:", filter);
        const jobsEmp = await qltd.Job.find(filter).skip((page - 1) * pagesize).limit(pagesize);
        const totalJobs = await Job.countDocuments(filter);
        return res.send({user: req.session.user, jobsEmp, pagesize, page, totalJobs});
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the applications.");
    }
}

module.exports = {
    getFormLogin,
    login,
    logout,
    getJobForEmp,
    getJobByFilterForEmp
};