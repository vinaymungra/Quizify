const express = require('express');
const { generateFeedback, mailSender } = require("../utils");

const router = express.Router();

router.post("/getFeedback", async (req, res, next) => {
    try {
        console.log("Paraj poche to che!!");
        const { attemptId, score, wrongQuestions, email } = req.body;
        
        const feedback = await generateFeedback(score, wrongQuestions);
        const emailSent = await mailSender(email, feedback);
        
        return res.json(feedback);
    } catch (err) {
        next(err);
    }
});

module.exports.FeedbackEmail =  router;
