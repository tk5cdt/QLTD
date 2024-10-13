const express = require('express')
const { connectDB } = require('../configs/connectDB')
const axios = require('axios')
const {Job} = require('../model/QLTuyenDung')

// Create and save a new job
const create = async (req, res) => {
    if(!req.body)
    {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const job = new Job({
        jobTitle: req.body.jobTitle,
        jobDescription: req.body.jobDescription,
        requirements: req.body.requirements,
        location: req.body.location,
        salaryRange: req.body.salaryRange,
        employmentType: req.body.employmentType,
        postedDate: stringToDate(req.body.postedDate),
        closingDate: stringToDate(req.body.closingDate),
        // applications: req.body.applications
    });
    job.save(job).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while creating the job."});
    });
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
                res.send(data);
            }
        }).catch(err => {
            res.status(500).send({message: err.message || `Error retrieving Job with id=${id}`});
        });
        return;
    }
    Job.find().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while retrieving jobs."});
    });
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

module.exports = {
    create,
    stringToDate,
    getJob,
    updateJob,
    deleteJob
}