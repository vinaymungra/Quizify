const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  axios = require('axios');

const { APP_SECRET, HISTORY_QUIZ_BINDING_KEY } = require("../config");
const { PublishMessage } = require("../../../CreateQuiz/src/utils/RabbitMQ");

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

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


module.exports.giveFeedback = async (feedbackData) => {
  try {
    
    const response = await axios.post('http://quizfeedback:8004/quizfeedback/getFeedback', feedbackData); 
    // The error connect ECONNREFUSED 127.0.0.1:8004 suggests that the service running on port 8004 (the quizfeedback service) 
    // is not reachable from the other microservices. This is likely due to the fact that you're running your services in 
    // Docker, and in Docker, 127.0.0.1 refers to the container itself, not the host or other containers.

    return ;
  } catch (error) {    
    console.log(error.message)
  }
};