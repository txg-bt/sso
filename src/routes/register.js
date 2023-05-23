const bcrypt = require("bcrypt");
const { logger } = require("../utils/logger");

const router = require("express").Router();
const { pool } = require("../database/database").pool;
const jwtGenerator = require("../utils/jwtGenerator").jwtGenerator;
const validatorMiddleware =
  require("../utils/validatorMiddleware").validatorMiddleware;

router.post("/register", validatorMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      logger({
        route: "register",
        statusCode: 400,
        message: "User already exists",
      });

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const genSalt = await _genSalt(saltRounds);
    const hash = await _hash(password, genSalt);

    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );

    const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].email);

    logger({
      route: "register",
      statusCode: 201,
      message: "Registered user",
      userId: user.rows[0].user_id,
    });

    return res.status(201).json({ token });
  } catch (err) {
    logger({ route: "register", statusCode: 500, message: err.message });
    console.log(err.message);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
