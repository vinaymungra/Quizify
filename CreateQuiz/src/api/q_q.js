const express = require('express');
const Q_QService = require("../services/q_q-service");

const router = express.Router();
const service = new Q_QService();

module.exports = (app, channel) => {
    
    router.post("/generateQuiz", async (req, res, next) => {
        try {
            const token = req.headers.authorization.replace("Bearer ", ""); 
            const { _id,grade, subject, totalQuestions, maxScore, difficulty } = req.body;
            
            const data = await service.generateQuiz({ _id,grade, subject, totalQuestions, maxScore, difficulty, token },channel);

            return res.json({ data });
        } catch (err) {
            next(err);
        }
    });
    router.put("/updateQuiz", async (req, res, next) => {
        try {
            // const token = req.headers.authorization.replace("Bearer ", ""); 
            const { quizId, question, } = req.body;
            
            const data = await service.updateQuizQuestion({ quizId,questionIndex,question },channel);

            return res.json({ data });
        } catch (err) {
            next(err);
        }
    });
    return router
}

