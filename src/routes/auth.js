const { logger } = require("../utils/logger");
require("dotenv").config();
const router = require("express").Router();

function validateToken(token) {
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
    message: "Authorized",
  });

  return {
    user_id: decoded.user_id,
    isAuthorized: true,
  };
}

router.get("/auth", (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = {
      ...validateToken(token),
    };

    return res.status(200).json(response);
  } catch (err) {
    logger({
      path: "auth",
      status: 500,
      message: err.message,
    });

    return res.status(500).json(err.message);
  }
});

module.exports = router;
