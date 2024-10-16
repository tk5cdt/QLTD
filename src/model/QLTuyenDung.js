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
        type: String,
        required: true,
    },

    resume: {
        type: String
    },

    resumeName: {
        type: String
    },

    applicationDate: {
        type: Date,
        required: true,
    },

    status: {
        type: String
    }
})

const employeesSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    jobs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs"
    }],
});

let Job = mongoose.model("jobs", jobSchema);
let Application = mongoose.model("applications", applicationSchema);
let Employees = mongoose.model("employees", employeesSchema);

module.exports= {Job, Application, Employees}