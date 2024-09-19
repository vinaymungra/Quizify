const mongoose = require('mongoose');
const { Schema } = mongoose;

const attemptSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  questions: [{
    text: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    userAnswer: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  }],
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  attemptDate: {
    type: Date,
    default: Date.now
  },
  isSubmitted: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Attempt', attemptSchema);





