const express = require('express')
const { connectDB } = require('../configs/connectDB')
const axios = require('axios')
const {Job} = require('../model/QLTuyenDung')
import qltd from '../model/QLTuyenDung';

const getFormCreateJob = async (req, res) => {
    return res.render('formCreateJob', { job: {}, message: "" });
}

// Create and save a new job
const create = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: "Content cannot be empty!" });
        }

        const postedDate = new Date(req.body.postedDate);
        const closingDate = new Date(req.body.closingDate);

        if (isNaN(postedDate) || isNaN(closingDate)) {
            return res.status(400).send({ message: "Invalid dates provided." });
        }

        if (closingDate <= postedDate) {
            return res.status(400).send({ message: "Closing Date must be after Posted Date." });
        }

        console.log(req.body);
        const job = new Job({
            jobTitle: req.body.jobTitle,
            jobDescription: Array.isArray(req.body.jobDescription) ? req.body.jobDescription : [],
            requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
            location: req.body.location,
            salaryRange: req.body.salaryRange,
            employmentType: req.body.employmentType,
            postedDate: postedDate,
            closingDate: closingDate,
            // applications: req.body.applications
        });

        const savedJob = await job.save();

        // return res.redirect('/api/getFormCreateJob', { job: savedJob, message: "Job created successfully!" });
        return res.redirect('/api/getFormCreateJob?message=Job created successfully!');
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating the job." });
    }
}

function stringToDate(dateString) {
    // Sử dụng constructor của Date để chuyển từ chuỗi sang Date
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
        throw new Error("Chuỗi không hợp lệ để chuyển thành ngày tháng.");
    }
    return new Date(timestamp);
}

const getJob = async (req, res) => {
    if(req.query.id)
    {
        const id = req.query.id;
        Job.findById(id).then(data => {
            if (!data) {
                res.status(404).send({message: `Not found Job with id=${id}`});
            } else {
                return res.render('jobdetail', { job: data, message: "" });
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
            const jobs = await qltd.Job.find().skip((page - 1) * pagesize).limit(pagesize);
            return res.render('listJob', { jobs, pagesize, page});
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

const updateJob = async (req, res) => {
    if(!req.body)
    {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const id = req.params.id;
    Job.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(data => {
        if (!data) {
            res.status(404).send({message: `Cannot update Job with id=${id}. Maybe Job was not found!`});
        } else {
            res.send({message: "Job was updated successfully."});
        }
    }).catch(err => {
        res.status(500).send({message: err.message || "Error updating Job with id=" + id});
    });
}

const deleteJob = async (req, res) => {
    const id = req.params.id;
    Job.findByIdAndDelete(id, {useFindAndModify: false}).then(data => {
        if (!data) {
            res.status(404).send({message: `Cannot delete Job with id=${id}. Maybe Job was not found!`});
        } else {
            res.send({message: "Job was deleted successfully."});
        }
    }).catch(err => {
        res.status(500).send({message: err.message || "Could not delete Job with id=" + id});
    });
}

const getJobByFilter = async (req, res) => {
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
        const jobs = await qltd.Job.find(filter).skip((page - 1) * pagesize).limit(pagesize);
        return res.send(jobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the applications.");
    }
}

const getJobRelated = async (req, res) => {
    const {id} = req.query;
    console.log("ID:", id);
    Job.findById(id).then(data => {
        if (!data) {
            res.status(404).json({message: `Not found Job with id=${id}`});
        } else {
            const location = data.location;
            const employmentType = data.employmentType;
            Job.find({$or: [{location: location}, {employmentType: employmentType}]}).then(data => {
                return res.send(data);
            }).catch(err => {
                res.status(500).send({message: err.message || "Some error occurred while retrieving jobs."});
            });
        }
    }).catch(err => {
        res.status(500).send({message: err.message || `Error retrieving Job with id=${id}`});
    });
}

module.exports = {
    getFormCreateJob,
    create,
    stringToDate,
    getJob,
    updateJob,
    deleteJob,
    getJobByFilter,
    getJobRelated
}