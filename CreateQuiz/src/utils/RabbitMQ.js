const amqplib = require("amqplib");
const {MESSAGE_BROKER_URL, QUEUE_NAME, EXCHANGE_NAME,CREATE_QUIZ_BINDING_KEY,HISTORY_QUIZ_BINDING_KEY}=require("../config/index")

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true }); 
    await channel.assertQueue(QUEUE_NAME, { durable: true }); 
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, CREATE_QUIZ_BINDING_KEY ); 
    return channel;
  } catch (err) {
    console.error("Failed to create channel:", err.message);
    throw err;
  }
};


module.exports.PublishMessage = async(channel, binding_key, message) => {
  try{
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  }
  catch(err){
    throw err
  }
};