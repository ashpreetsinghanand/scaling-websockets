const WebSocket = require("ws");
const priorityQueue = [];

const enqueueMessage = (message, priority) => {
    console.log("enqueu",message)
  priorityQueue.push({ message, priority });
  priorityQueue.sort((a, b) => b.priority - a.priority);
};

const processMessages = (wss) => {
  while (priorityQueue.length > 0) {
    const { message } = priorityQueue.shift();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("priority queue",message)
        client.send(message, { binary: false });
      }
    });
  }
};

module.exports = { enqueueMessage, processMessages };
