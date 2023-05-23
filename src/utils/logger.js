const WebSocket = require("ws");

const loggerSocket = new WebSocket("ws://localhost:8081");

function logger({ route, statusCode, message, userId }) {
  loggerSocket.send(
    JSON.stringify({
      route,
      statusCode,
      message,
      userId,
      appName: "sso-service",
      timestamp: new Date().getTime(),
    })
  );
}

module.exports = { logger };
