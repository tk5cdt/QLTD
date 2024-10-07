import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
    app.use('/public/uploads', express.static('./src/public/uploads'))
    
}

module.exports = configViewEngine;