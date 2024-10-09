const express = require('express')
const { connectDB } = require('../configs/connectDB')
const axios = require('axios')

const getTest = (req, res) => {
    const str = "Hello World";
    res.render('index', { str: str, str2: "Hello World 2" });
}

module.exports = {
    getTest
}