const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 3000);
//app.set("trust proxy", true);

app.use("", require("./src/routes/login"));
app.use("", require("./src/routes/register"));
app.use("", require("./src/routes/auth"));

app.get("*", async (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(app.get("port"), function () {
  console.log(`Starting server on port ${app.get("port")}`);
});
