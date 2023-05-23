const { logger } = require("./logger");

function validatorMiddleware(req, res, next) {
  const { email, password } = req.body;

  function validateEmail(userEmail) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(userEmail).toLowerCase());
  }

  if (req.path === "/register") {
    if (!email || !password) {
      logger({
        route: "register",
        statusCode: 401,
        message: "Empty email and password",
      });

      return res.status(401).json({
        message: "Please fill out all fields",
      });
    }

    if (!validateEmail(email)) {
      logger({
        route: "register",
        statusCode: 401,
        message: "Invalid email",
      });

      return res.status(401).json({
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      logger({
        route: "register",
        statusCode: 401,
        message: "Password too small",
      });

      return res.status(401).json({
        message: "Password must be at least 8 characters",
      });
    }

    logger({
      route: "register",
      statusCode: 200,
      message: "Passed checks",
    });
  }

  if (req.path === "/login") {
    if (!email || !password) {
      logger({
        route: "login",
        statusCode: 401,
        message: "Empty email and password",
      });

      return res.status(401).json({
        message: "Please fill out all fields",
      });
    }

    if (!validateEmail(email)) {
      logger({
        route: "login",
        statusCode: 401,
        message: "Empty email and password",
      });

      return res.status(401).json({
        message: "Invalid email",
      });
    }

    logger({
      route: "login",
      statusCode: 200,
      message: "Passed checks",
    });
  }

  next();
}

module.exports = { validatorMiddleware };
