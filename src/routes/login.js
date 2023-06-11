const { logger } = require("../utils/logger");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const { pool } = require("../database/database");
const jwtGenerator = require("../utils/jwtGenerator").jwtGenerator;
const validatorMiddleware =
  require("../utils/validatorMiddleware").validatorMiddleware;

router.post("/login", validatorMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      logger({ route: "login", statusCode: 401, message: "User not found" });

      return res.status(401).json({
        message: "User does not exist",
      });
    }

    const validPass = await bcrypt.compare(password, user.rows[0].password);

    if (!validPass) {
      logger({ route: "login", statusCode: 401, message: "Incorect password" });

      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwtGenerator(user.rows[0].user_id, user.rows[0].email);

    logger({
      route: "login",
      statusCode: 201,
      message: "Logged in user",
      userId: user.rows[0].user_id,
    });

    return res.status(201).json({ token });
  } catch (err) {
    logger({ route: "login", statusCode: 500, message: err.message });
    console.log(err.message);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
