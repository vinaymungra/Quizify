const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME:process.env.EXCHANGE_NAME,
  QUEUE_NAME:process.env.QUEUE_NAME,
  HISTORY_QUIZ_BINDING_KEY: process.env.HISTORY_QUIZ_BINDING_KEY,
  CREATE_QUIZ_BINDING_KEY:process.env.CREATE_QUIZ_BINDING_KEY,
  QUEUE_NAME_2:process.env.QUEUE_NAME_2
};
