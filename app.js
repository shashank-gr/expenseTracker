const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRoute);

app.use((req, res) => {
  console.log(req.url);
  res.send("Hello from express");
});
app.listen(3000);
