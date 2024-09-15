const WebSocket = require("ws");
const { redisClient, pubClient, subClient } = require('./config/redis');
const { adjustHeartbeatInterval, createHeartbeatTimer } = require('./services/heartbeat');
const { handlePubSubMessages } = require('./services/message');
const { checkRateLimit, handleConnection, handleDisconnection } = require('./services/session');

const port = 8081
const wss = new WebSocket.Server({ port: port });

const connectionCounts = new Map(); // Track the number of connections per IP
let connectedClients = 0; // Track the number of clients connected

const heartbeatTimer = createHeartbeatTimer(wss);
handlePubSubMessages(wss);

wss.on("connection", async (ws, req) => {
  const clientId = await handleConnection(ws, req, wss, connectionCounts, connectedClients);
  if (!clientId) return;

  ws.on("message", async (message) => {
    const currentTime = Date.now();
    const rateLimitOk = await checkRateLimit(clientId, currentTime);

    if (!rateLimitOk) {
      ws.send("Rate limit exceeded. Please slow down.");
      return;
    }

    const parsedMessage = JSON.parse(message);
    const priority = parsedMessage.type === "critical" ? 3 : parsedMessage.type === "normal" ? 2 : 1;

    const clientMessage = {
        type: parsedMessage.type,
        content: `${clientId.substr(0, 5)} said: ${parsedMessage.content}`,
        priority: priority,
      };
      
      // Serialize the message as JSON
      const messageToSend = JSON.stringify(clientMessage);
      
      // Publish message to Redis
      pubClient.publish("broadcast", messageToSend);
      
      // Broadcast locally (for clients on this server)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageToSend);
        }
      });
      
  });

  ws.on("close", async () => {
    await handleDisconnection(ws, clientId, connectionCounts, connectedClients);
    adjustHeartbeatInterval(connectedClients);
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);

process.on("SIGINT", () => {
  redisClient.quit();
  pubClient.quit();
  subClient.quit();
  clearInterval(heartbeatTimer);
  process.exit();
});
