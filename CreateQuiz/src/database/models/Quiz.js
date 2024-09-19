const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
    _id: {
        type: String,
        required: true,
        auto: false,
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
        answer: {
            type: String,
            required: true,
        },
    }],
    score: {
        type: Number,
        default: 0,
    },
    generationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Quiz', quizSchema);
