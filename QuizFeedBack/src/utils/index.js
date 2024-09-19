const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer=require("nodemailer")

const { APP_SECRET,GROQ,MAIL_HOST,MAIL_PASS,MAIL_USER } = require("../config");
const Groq=require('groq-sdk');
const groq = new Groq({ apiKey:GROQ });

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {

  // console.log(enteredPassword);
  // console.log(savedPassword);
  
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

module.exports.generateFeedback = async (score, wrongQuestions) => {
  
  let questionsFeedback = wrongQuestions.map((question, index) => {
    return `
      Question ${index + 1}: ${question.text}
      User Answer: ${question.userAnswer}
      Correct Answer: ${question.answer}
      Options: 
        A: ${question.options[0]}
        B: ${question.options[1]}
        C: ${question.options[2]}
        D: ${question.options[3]}
      Provide advice on how to approach similar questions to avoid mistakes.
    `;
  }).join('\n\n');
  

  const promptContent = `
    Based on the following questions where the student made mistakes, generate personalized feedback. 
    Provide suggestions and key points the student should keep in mind to improve in these areas.
    The feedback should be in JSON format, with each question's feedback clearly outlined.
    ${questionsFeedback}

    Include a summary feedback that considers the overall score (${score} out of ${wrongQuestions.length + score}) and 
    gives additional guidance on what topics or strategies the student should focus on in order to avoid mistakes in this 
    type of questions and suggest to practice resourses to master suggested topics.

    
    Format the response in JSON:
    
      "summaryFeedback": "General feedback and advice based on the student's overall performance.",
      "questionsFeedback": [
        {
          "question": "Text of the question",
          "feedback": "Detailed advice and strategies for improvement. Give in 100 words",
        }
      ]
    }
  `;
  

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
    return questions;

  } catch (error) {
    console.error('Error generating feedback with Groq:', error);
    throw new Error('Failed to generate feedback using Groq');
  }
};


module.exports.mailSender = async (email, feedback) => {
  try {
    const body = this.feedbackTemplate(feedback);

    let transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: 'PLAYPOWER',
      to: `${email}`,
      subject: 'Feedback for QUIZ',
      html: body,
    });

    return info;
  } catch (err) {
    console.log(err);
  }
};

module.exports.feedbackTemplate = (feedback) => {
  
  const feedbackSections = feedback
    .map(
      (item, index) => `
      <div class="question-feedback">
        <h3>Question ${index + 1}:</h3>
        <p class="question-text">${item.question}</p>
        <p class="feedback-text">${item.feedback}</p>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>Quiz Feedback</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: left;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
      }

      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .question-feedback {
        background-color: #f8f8f8;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 5px;
      }

      .question-text {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .feedback-text {
        font-size: 14px;
        color: #555;
      }

      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="header">
        <h2>Quiz Feedback</h2>
        <p>Dear User,</p>
        <p>Thank you for participating in the quiz. Here is your personalized feedback:</p>
      </div>
      
      ${feedbackSections}
      
      <div class="support">
        <p>If you have any questions or need further assistance, please contact our support team.</p>
      </div>
    </div>
  </body>
  
  </html>`;
};


