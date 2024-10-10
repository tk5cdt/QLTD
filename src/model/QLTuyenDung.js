const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({

    jobTitle: {
        type: String,
        required: true,
    },

    jobDescription:{
        type: String,
        required: true,
    },

    requirements: {
        type: [String],
    },

    location: {
        type: String,
        required: true,
    },
    
    salaryRange: {
        type: Number,
        required: true,
    },

    employmentType: {
        type: String,
        required: true,
    },

    postedDate: {
        type: Date,
        required: true,
    },

    closingDate: {
        type: Date,
        required: true,
    },

    applications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "applications"
    }]
})

const applicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
    },

    phone: {
        type: Number,
        required: true,
    },

    resume: {
        type: String,
        required: true,
    },

    applicationDate: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        required: true,
    },

    jobs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs"
    }],

    interviews:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "interview"
    }
})

const interviewSchema = new mongoose.Schema({
    interviewDate: {
        type: Date,
        required: true,
    },

    result: {
        type: String,
        required: true,
    },

    applications:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "applications"
    }
})

let Job = mongoose.model("jobs", jobSchema);
let Application = mongoose.model("applications", applicationSchema);
let Interview = mongoose.model("interview", interviewSchema);

module.exports= {Job, Application, Interview}