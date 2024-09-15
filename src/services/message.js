const { pubClient, subClient } = require('../config/redis');
const { enqueueMessage, processMessages } = require('../utils/priorityQueue');


const handlePubSubMessages = (wss) => {
  subClient.subscribe("broadcast", (message) => {
    try {
        const parsedMessage = JSON.parse(message);
       
      enqueueMessage(parsedMessage.content, parsedMessage.priority || 1);
      processMessages(wss);
    } catch (error) {
      console.error("Error parsing message from Redis:", error);
    }
  });
};

module.exports = { handlePubSubMessages };
