const express = require('express');
const cors = require('cors');
const attempt  = require('./api/AttemptQuiz');
const client = require('./client');

const RATE_LIMIT_INTERVAL = 10; 

module.exports = async (app, channel) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());

    
    app.use(async (req, res, next) => {
        const userId = req.body.email; 

        if (!userId) {
            return res.status(400).json({ message: "Email ID is required" });
        }

        try {
            
            const lastRequestTime = await client.get(`rate-limit:${userId}`);
            const currentTime = Math.floor(Date.now() / 1000);

            if (lastRequestTime && currentTime - lastRequestTime < RATE_LIMIT_INTERVAL) {
                return res.status(429).json({ message: `Please wait ${RATE_LIMIT_INTERVAL - (currentTime - lastRequestTime)} seconds before retrying.` });
            }

            await client.set(`rate-limit:${userId}`, currentTime);
            next();
        
        } catch (error) {
            console.error('Error with rate limiting:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    
    app.use('/historyquiz', attempt(app, channel));
};
