const { QuizModel } = require("../models");
const { APIError } = require("../../utils/app-errors");
const { generateQuestions, afterGeneratingAddQuiz } = require("../../utils");
const { APP_SECRET} = require("../../config/index");

class Q_QRepository {

  async saveQuestions({ subject, difficulty, totalQuestions }) {

      const questionsData = await generateQuestions(subject, difficulty, totalQuestions);
      return questionsData;
  }

  async saveQuiz({_id, grade, subject, totalQuestions, maxScore, difficulty, questions,token },channel) {

    // console.log(questions)
      // const FormatedQuestions = questions.map((q) => ({
      //   text: q.question,
      //   options: [q.A, q.B, q.C, q.D],
      //   answer: q.correctAnswer,
      //   userAnswer:"NULL"
      // }));
      const FormatedQuestions = [{
        text:"What is the value of x in the equation 2x + 3 = 7?",
        options:["A","B","C","D"],
        answer:"B",
        userAnswer:"NULL"
    } ]
      const obj={
        _id,
        grade,
        subject,
        totalQuestions,
        maxScore,
        difficulty,
        questions:FormatedQuestions 
      }
  //     console.log("below")
  //  console.log(obj)

      const newQuiz = await QuizModel(obj);
      const response = await newQuiz.save();
      let quizData={
        quizId:newQuiz._id,
        questions:FormatedQuestions,
        grade,
        subject,
        totalQuestions,
        maxScore,
        difficulty,
        isSubmitted:false
      }
      await afterGeneratingAddQuiz(quizData,token,channel)

      return response;
    
  }

  async  saveUpdatedQuestion({ quizId, questionIndex, updatedQuestion }) {
    try {
        // Find the quiz by ID and update the specific question at the given index
        const updatedQuiz = await QuizModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(quizId), "questions._id": mongoose.Types.ObjectId(questionIndex) },
          {
              $set: {
                  "questions.$.text": updatedQuestion.text,
                  "questions.$.options": updatedQuestion.options,
                  "questions.$.answer": updatedQuestion.answer,
                  "questions.$.userAnswer": updatedQuestion.userAnswer,
              }
          },
          { new: true, runValidators: true } // Return the updated quiz and run schema validation
      );        
      if (!updatedQuiz) {
        throw new Error('Quiz or question not found');
    }

    return updatedQuiz;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
}



}

module.exports = Q_QRepository;
