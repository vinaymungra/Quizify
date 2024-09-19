const { giveFeedback } = require("../../utils");
const Attempt = require("../models/attempt");

class AttemptRepository {
    
    async create(attemptData) {
        try {
            const quizFirstTime = new Attempt(attemptData);
            return await quizFirstTime.save();
        } catch (error) {
            throw new Error('Error creating attempt: ' + error.message);
        }
    }

    async newAttempt(attemptData,wrongQuestions) {
        try {
            const new_Attempt = await Attempt.create(attemptData);

            if (!new_Attempt) {
                throw new Error('Failure in attempting quiz again.');
            }
            const feedbackData = {
                
                score: attemptData.score,
                wrongQuestions: wrongQuestions,
                email: attemptData.email
            };
            
            console.log(feedbackData)

            await giveFeedback(feedbackData);
            
            return new_Attempt;
        } catch (error) {
            throw new Error('Error attempting quiz again.: ' + error.message);
        }
    }

    async updateAnswers(attemptData,wrongQuestions) {
        try {
            const { email, quizId, questions, score } = attemptData;
    
            
            const existingAttempt = await Attempt.findOne({ email, quizId });
            if (!existingAttempt) {
                console.log('No attempt found with provided email and quizId:', { email, quizId });
                throw new Error('Attempt not found for the provided email and quizId.');
            }
    
            // console.log('Existing Attempt:', existingAttempt); 
           
            const updatedAttempt = await Attempt.findOneAndUpdate(
                { email, quizId },
                { $set: { score, questions, isSubmitted: true } },
                { new: true }
            );
    
            if (!updatedAttempt) {
                throw new Error('Attempt not found for the provided email and quizId.');
            }
            const feedbackData = {
                
                score: attemptData.score,
                wrongQuestions: wrongQuestions,
                email: attemptData.email
            };
            
            // console.log(feedbackData)
            await giveFeedback(feedbackData);

            return updatedAttempt;
        } catch (error) {
            console.error('Error updating attempt:', error.message);
            throw new Error('Error updating attempt: ' + error.message);
        }
    }

    async getFilteredQuizzes(filters) {
        try {
            
            const query = {};

            if (filters.from && filters.to) {
                query.attemptDate = {
                    $gte: filters.from,
                    $lte: filters.to,
                };
            }

            if (filters.grade) {
                query.grade = filters.grade;
            }

            if (filters.subject) {
                query.subject = filters.subject;
            }

            if (filters.minScore||filters.maxScore) {
                query.score = {
                    $gte: filters.minScore,
                    $lte: filters.maxScore,
                };
            }
            const attempts = await Attempt.find(query).exec();
            return attempts;
        } catch (error) {
            console.error('Error fetching filtered quizzes:', error);
            throw new Error('Error fetching filtered quizzes: ' + error.message);
        }
    }
    async getMaxScoreQuiz({email}) {
        try {
            
            
            const secondHighestScoreQuiz = await Attempt.find({ email })
            .sort({ score: -1 })
            .skip(1) // Skip the highest score to get the second highest
            .limit(1) // Limit the result to one document
            .exec();
            return secondHighestScoreQuiz;
        } catch (error) {
            console.error('Error fetching filtered quizzes:', error);
            throw new Error('Error fetching filtered quizzes: ' + error.message);
        }
    }

}

module.exports = AttemptRepository;
