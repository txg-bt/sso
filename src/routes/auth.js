const WebSocket = require("ws");
const { logger } = require("../utils/logger");
require("dotenv").config();

function validateToken(token) {
  try {
    const cleanedUpToken = token.replace("Bearer ", "");

    if (!cleanedUpToken) {
      logger({
        path: "auth",
        status: 404,
        message: "No Token",
      });

      return {
        user_id: null,
        isAuthorized: false,
      };
    }

    const decoded = jwt.verify(cleanedUpToken, process.env.JWT_SECRET);

    logger({
      path: "auth",
      status: 200,
      message: "Atuhorized",
    });

    return {
      user_id: decoded.user_id,
      isAuthorized: true,
    };
  } catch (err) {
    console.log(err.message);
    logger({
      path: "auth",
      status: 500,
      message: err.message,
    });

    return {
      user_id: null,
      isAuthorized: false,
    };
  }
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("A client connected.");
  logger({
    path: "auth",
    status: 200,
    message: "Client Connected",
  });

  ws.on("message", (request) => {
    const parsedRequest = JSON.parse(request);

    const response = {
      requestId: parsedRequest.requestId,
      ...validateToken(parsedRequest.token),
    };

    ws.send(JSON.stringify(response));
  });

  ws.on("close", () => {
    console.log("A client disconnected.");

    logger({
      path: "auth",
      status: 200,
      message: "Client Disconected",
    });
  });
});

console.log("WebSocket server is running on port 8080.");
