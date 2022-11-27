const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const userRoute = require("./routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRoute);

app.use((req, res) => {
  console.log(req.url);
  res.send("Hello from express");
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Sequelize sync failed");
    console.log(err);
  });
