import e from 'express';
import { connectDB } from '../configs/connectDB';
import axios from "axios";

const getTest = (req, res) => {
    const str = "Hello World";
    res.render('index', { str: str, str2: "Hello World 2" });
}

module.exports = {
    getTest
}