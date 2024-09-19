const AttemptRepository = require("../database/repository/attempt-repository");
const { FormateData } = require('../utils');

class AttemptService {
    constructor() {
        this.repository = new AttemptRepository();
    }
    async createQuizFirstTime(attemptData) {
        try {
            
            return await this.repository.create(attemptData);;
        } catch (error) {
            throw new Error('Error saving quiz attempt: ' + error.message);
        }
    }
    async newAttemptOrOldAttemptQuiz(attemptData,wrongQuestions) {
        try {

            if(attemptData.isSubmitted){
                return await this.repository.newAttempt(attemptData,wrongQuestions);
            }
            else 
                return await this.repository.updateAnswers(attemptData,wrongQuestions);
       
        } catch (error) {
            throw new Error('Error saving quiz attempt: ' + error.message);
        }
    }

    async CalculateScores({questions, wrongQuestions}){
        let score = 0;
        // console.log(questions)
        
        questions.map(obj => {
                        
            const { answer, userAnswer } = obj;

            if (answer === userAnswer) {
                score++; 
            }
            else{
                wrongQuestions.push(obj);
            }
        });

        return score;
    }

    
    async getFilteredQuizzes({ email, from, to, grade, subject, minScore, maxScore }) {
        try {
            let fromDate = from ? new Date(from) : new Date('1970-01-01');
            let toDate = to ? new Date(to) : new Date();
            toDate.setHours(23, 59, 59, 999); // Include the entire 'to' day

            
            const filters = {
                email,
                from: fromDate,
                to: toDate,
                grade,
                subject,
                minScore,
                maxScore,
                
            };

            const response = await this.repository.getFilteredQuizzes(filters);
            return response;
        } catch (error) {
            throw new Error('Error fetching filtered quizzes: ' + error.message);
        }
    }
    async getQuizWithMaxScore({ email}) {
        try {
            
            const response = await this.repository.getMaxScoreQuiz({email});
            return response;
        } catch (error) {
            throw new Error('Error fetching filtered quizzes: ' + error.message);
        }
    }

}

module.exports = AttemptService;
