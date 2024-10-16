// import qltd from '../model/QLTuyenDung';
const {Application} = require('../model/QLTuyenDung');

const getFormApply = async (req, res) => {
    let id = "670b99a1b9c798484963f701";
    try {
        const job = await qltd.Job.findById(id);
        return res.render('formApply', { job, message: "" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the job.");
    }
};

const postFormApply = async (req, res) => {
    const application = qltd.Application(req.body);
    application.applicationDate = new Date();
    application.status = "Pending";
    await application.save();
    const job = await qltd.Job.findById(req.params.id);
    job.applications.push(application);
    await job.save();
    return res.render('formApply', { job, message: "Application submitted successfully!" });
}

module.exports = { getFormApply, postFormApply }