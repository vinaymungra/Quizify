const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  APP_SECRET: process.env.APP_SECRET,
  GROQ: process.env.GROQ_API_KEY,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME:process.env.EXCHANGE_NAME,
  HISTORY_QUIZ_BINDING_KEY: process.env.HISTORY_QUIZ_BINDING_KEY,
  QUEUE_NAME_2:process.env.QUEUE_NAME_2
};
