const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {GROQ, CREATE_QUIZ_BINDING_KEY} = require('../config/index')
const Groq=require('groq-sdk');
const groq = new Groq({ apiKey:GROQ });
const { APP_SECRET } = require("../config");
const axios = require('axios');
const { PublishMessage } = require("./RabbitMQ");



module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  return (await bcrypt.compare(enteredPassword,savedPassword));
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.generateQuestions= async(subject, difficulty, totalQuestions) =>{
    
  const promptContent = `Generate ${totalQuestions} ${difficulty} level ${subject} questions with multiple-choice options. 
  Include the question text, four options labeled A, B, C, D, and indicate the correct answer for each question. 
  Give response in JSON format including parsing
{
  question:"text of question",
  "A":"option A",
  "B":"option B",
  "C":"option C",
  "D":"option D",
  correctAnswer:"A or B or C or D"
}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: promptContent,
        },
      ],
      model: 'llama3-8b-8192',
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    const jsonString = await generatedContent.match(/\[(.|\n)*?\]/)?.[0];
    
    const questions =await  eval(jsonString);
    console.log(questions)
    
    return questions;
  } catch (error) {
    console.error('Error generating questions with Groq:', error);
    throw new Error('Failed to generate questions using Groq');
  }
}

module.exports.afterGeneratingAddQuiz = async (quizData,token,channel) => {
  try {
    const payload = await jwt.verify(token, APP_SECRET);
    const email= payload.email
    quizData={...quizData,email}

    PublishMessage(channel,CREATE_QUIZ_BINDING_KEY,JSON.stringify(quizData));

    return ;
  } catch (error) {    
    console.log(error.message)
  }
};
