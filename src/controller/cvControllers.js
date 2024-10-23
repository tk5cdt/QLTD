import qltd from '../model/QLTuyenDung';
const axios = require('axios');
const { uploadFile, downloadFile } = require('../configs/googledrive');

const getFormApply = async (req, res) => {
    let id = req.params.id || "670ad18960064e36c4acb363";
    try {
        const job = await qltd.Job.findById(id);
        if (!job) {
            return res.status(404).send("Job not found!");
        }
        return res.render('formApply', { user: req.session.user, job, message: "" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the job.");
    }
};

const postFormApply = async (req, res) => {
    try {
        const job = await qltd.Job.findById(req.params.id);
        if (!job) {
            return res.render('formApply', { user: req.session.user, job, message: "Job not found!" });
        }

        if (!req.file || req.file.length === 0) {
            console.log(req.file);
            console.log(req.body.file);
            console.log('No file uploaded');
            return res.render('formApply', { user: req.session.user, job, message: "Please upload your resume!" });
        }
        console.log(req.file);
        console.log('req buffer' + req.file.buffer);
        const timestamp = new Date().getTime();
        let file = req.file;
        file.originalname = `${timestamp}_${file.originalname}`;
        console.log('file buffer' + file.buffer);

        //upload file to google drive
        const result = await uploadFile(file);
        console.log(result);
        
        if (!result) {
            // return res.render('formApply', { user: req.session.user, job, message: "An error occurred while uploading the resume. Please try again later." });
            return res.status(500).send({ message: "An error occurred while uploading the resume. Please try again later." });
        }


        const application = new qltd.Application(req.body);
        application.applicationDate = new Date();
        application.status = "Pending";
        application.resume = result.id;
        application.resumeName = file.originalname;

        await application.save();

        job.applications.push(application);
        await job.save();

        // return res.render('formApply', { user: req.session.user, job, message: "Application submitted successfully!" });
        return res.status(200).send({ message: "Application submitted successfully!" });
    } catch (error) {
        const job = await qltd.Job.findById(req.params.id);
        if (!job) {
            return res.render('formApply', { user: req.session.user, job, message: "Job not found!" });
        }
        // console.error("An error occurred:", error);
        // return res.status(500).render('formApply', { user: req.session.user, job, message: "An error occurred while submitting the application. Please try again later." });
        return res.status(500).send({ message: "An error occurred while submitting the application. Please try again later." });
    }
};

const getListApplication = async (req, res) => {
    if(!req.session.user){
        return res.status(401).render('401')
    }
    let id = req.params.id;
    let pagesize = req.query.pagesize || 10;
    let page = req.query.page || 1;
    try {
        const job= await qltd.Job.findById(id);
        if (!job) {
            return res.status(404).send("Job not found!");
        }
        const applications = await qltd.Application.find({ _id: { $in: job.applications } }).sort({applicationDate: 1}).skip((page - 1) * pagesize).limit(pagesize);
        return res.render('listApplication', { user: req.session.user, job, applications, pagesize, page});
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the applications.");
    }
};

const downloadCV = async (req, res) => {
    const id = req.params.id;
    try {
        const application = await qltd.Application.findById(id);
        if (!application) {
            return res.status(404).send("Application not found!");
        }

        const file = await downloadFile(application.resume);
        if (!file) {
            return res.status(404).send("File not found!");
        }

        const filename = application.resumeName || 'downloadedResume.pdf';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        file.pipe(res)
            .on('finish', () => {
                console.log('File streamed successfully.');
            })
            .on('error', (error) => {
                console.error('Error during file streaming:', error);
                if (!res.headersSent) {
                    res.status(500).send("Failed to download file.");
                }
            });

    } catch (error) {
        console.error("Error downloading CV:", error);
        res.status(500).send("An error occurred while downloading the file.");
    }
};


module.exports = { getFormApply, postFormApply, getListApplication, downloadCV };