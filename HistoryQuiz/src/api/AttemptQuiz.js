const express = require('express');
const AttemptService = require("../services/attempt-service");
const { SubscribeMessage } = require("../utils/RabbitMQ");

const router = express.Router();

module.exports = (app, channel) => {
    const service1 = new AttemptService();
    SubscribeMessage(channel, service1);

    router.post("/addQuiz", async (req, res, next) => {
        try {
            const { email, quizId, questions, grade, subject, totalQuestions, maxScore, difficulty, isSubmitted } = req.body;
            const saveAttempt = await service1.createQuizFirstTime({
                email,
                quizId,
                grade,
                subject,
                totalQuestions,
                maxScore,
                difficulty,
                questions,
                isSubmitted
            });

            return res.json(saveAttempt);
        } catch (err) {
            next(err);
        }
    });

    router.put("/attempt", async (req, res, next) => {
        try {

            // console.log("Attempt a poche che ")
            const { email, quizId, questions, grade, subject, totalQuestions, maxScore, difficulty, isSubmitted } = req.body;
            const ratio = maxScore / totalQuestions;
            const wrongQuestions = [];
            let score = await service1.CalculateScores({ questions, wrongQuestions });
            score *= ratio;

            const savedAttempt = await service1.newAttemptOrOldAttemptQuiz({
                email,
                quizId,
                questions,
                grade,
                score,
                subject,
                totalQuestions,
                maxScore,
                difficulty,
                isSubmitted
            }, wrongQuestions);

            return res.json(savedAttempt);
        } catch (err) {
            next(err);
        }
    });

    router.get("/getFilteredQuizzes", async (req, res, next) => {
        try {
            const { email, from, to, grade, subject, minScore, maxScore } = req.body;
            const filteredQuizzes = await service1.getFilteredQuizzes({
                email,
                from,
                to,
                grade,
                subject,
                minScore,
                maxScore
            });

            return res.json(filteredQuizzes);
        } catch (err) {
            next(err);
        }
    });

    router.get("/getMaxScoreQuiz", async (req, res, next) => {
        try {
            const { email } = req.body;
            const filteredQuizzes = await service1.getQuizWithMaxScore({ email });
            return res.json(filteredQuizzes);
        } catch (err) {
            next(err);
        }
    });
   

    return router;
};
