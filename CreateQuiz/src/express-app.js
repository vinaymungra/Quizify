const express = require('express');
const cors = require('cors');
const q_qRouter = require('./api/q_q');  

module.exports = async (app, channel) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());

   
    app.use('/createquiz', q_qRouter(app, channel));
};
