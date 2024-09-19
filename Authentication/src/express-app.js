const express = require('express');
const cors = require('cors');
const userRouter = require('./api/userRouter');  

module.exports = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use('/authentication', userRouter);  
};
