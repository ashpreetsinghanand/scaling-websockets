const { v4: uuidv4 } = require("uuid");
const { redisClient } = require('../config/redis');

const MAX_MESSAGES_PER_SECOND = 2;

const checkRateLimit = async (clientId, currentTime) => {
  const sessionData = await redisClient.hGetAll(`session:${clientId}`);
  let messageCount = parseInt(sessionData.messageCount) || 0;
  let lastMessageTimestamp = parseInt(sessionData.lastMessageTimestamp) || currentTime;

  if (currentTime - lastMessageTimestamp < 1000) {
    messageCount++;
  } else {
    messageCount = 1; // Reset counter every second
    lastMessageTimestamp = currentTime;
  }

  if (messageCount > MAX_MESSAGES_PER_SECOND) {
    return false; // Rate limit exceeded
  }

  await redisClient.hSet(`session:${clientId}`, {
    messageCount: messageCount,
    lastMessageTimestamp: lastMessageTimestamp,
  });

  return true;
};

const handleConnection = async (ws, req, wss, connectionCounts, connectedClients) => {
  const clientIp = req.socket.remoteAddress;
  const currentConnectionCount = connectionCounts.get(clientIp) || 0;

  if (currentConnectionCount >= 3) {
    ws.send("Exceeded the limit of connections per IP");
    ws.close();
    return;
  }

  connectionCounts.set(clientIp, currentConnectionCount + 1);
  connectedClients++;

  const clientId = uuidv4();
  const exists = await redisClient.hExists(`session:${clientId}`, "messageCount");
  if (!exists) {
    await redisClient.hSet(`session:${clientId}`, "messageCount", 0);
    await redisClient.hSet(`session:${clientId}`, "lastMessageTimestamp", Date.now());
  }

  ws.send(`Your ID is: ${clientId}`);
  return clientId;
};

const handleDisconnection = async (ws, clientId, connectionCounts, connectedClients) => {
    try {
      // Attempt to retrieve IP address from connectionCounts if needed
      const clientIp = ws._socket.remoteAddress; // Some WebSocket libraries have this property
      if (clientIp && connectionCounts.has(clientIp)) {
        connectionCounts.set(clientIp, connectionCounts.get(clientIp) - 1);
      }
      connectedClients--;
  
      await redisClient.del(`session:${clientId}`);
    } catch (error) {
      console.error("Error handling disconnection:", error);
    }
  };
  

module.exports = { checkRateLimit, handleConnection, handleDisconnection };
