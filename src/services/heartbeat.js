const WebSocket = require("ws");
let heartbeatInterval = 15000; // Default heartbeat interval (15 seconds)

const adjustHeartbeatInterval = (connectedClients) => {
  if (connectedClients <= 1) {
    heartbeatInterval = 5000; // Few clients, send heartbeat every 5 seconds
  } else if (connectedClients <= 2) {
    heartbeatInterval = 10000; // Moderate load, send heartbeat every 10 seconds
  } else {
    heartbeatInterval = 30000; // High load, send heartbeat every 30 seconds
  }
};

const sendHeartbeats = (wss) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "heartbeat", timestamp: Date.now() }));
    }
  });
};

const createHeartbeatTimer = (wss) => {
  return setInterval(() => sendHeartbeats(wss), heartbeatInterval);
};

module.exports = { adjustHeartbeatInterval, createHeartbeatTimer };
