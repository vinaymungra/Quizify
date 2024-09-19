const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME, CREATE_QUIZ_BINDING_KEY } = require("../config/index")

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true }); 
    await channel.assertQueue(QUEUE_NAME, { durable: true }); 
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, CREATE_QUIZ_BINDING_KEY); 
    return channel;
  } catch (err) {
    console.error("Failed to create channel:", err.message);
    throw err;
  }
};

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CREATE_QUIZ_BINDING_KEY);

    channel.consume(appQueue.queue, async (data) => {
      try {
        console.log("Received data");
        console.log(data.content.toString());

        
        await service.createQuizFirstTime(JSON.parse(data.content.toString()));

        
        channel.ack(data);
      } catch (error) {
        console.error("Error processing message:", error);
        
        channel.nack(data, false, false);
      }
    });
  } catch (error) {
    console.error("Error subscribing to message:", error);
  }
};
