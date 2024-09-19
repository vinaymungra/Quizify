const { Q_QRepository } = require("../database");
const { APIError } = require("../utils/app-errors");

class Q_QService {
    constructor() {
        this.repository = new Q_QRepository();
    }

    async generateQuiz({_id, grade, subject, totalQuestions, maxScore, difficulty,token },channel) {
        try {
            

            // const questions = await this.repository.saveQuestions({ subject, difficulty, totalQuestions });
            const questions = [{
                text:"What is the value of x in the equation 2x + 3 = 7?",
                options:["A","B","C","D"],
                answer:["B"]
            } ]
            // console.log(questions)
            const quiz = await this.repository.saveQuiz({_id, grade, subject, totalQuestions, maxScore, difficulty, questions ,token},channel);
            console.log(quiz)
            return quiz;

        } catch (error) {
            console.error('Error generating quiz:', error);
            throw new APIError('API Error', 500, 'Failed to generate quiz');
        }
    }
    async updateQuizQuestion({ quizId,questionIndex,question },channel) {
        try {
            
            // const questions = await this.repository.saveUpdatedQuestion({ quizId,questionIndex,question });
            // console.log(questions)

            // return questions;

        } catch (error) {
            console.error('Error generating quiz:', error);
            throw new APIError('API Error', 500, 'Failed to generate quiz');
        }
    }
}

module.exports = Q_QService;
