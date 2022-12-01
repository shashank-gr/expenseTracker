const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const razorPayRoute = require("./routes/razorPay");
const premiumRoute = require("./routes/premium");
const forgotPassRoute = require("./routes/forgotPass");
const User = require("./model/user");
const Expense = require("./model/expense");
const ResetPass = require("./model/reset-password");
const FileLink = require("./model/file-link");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/razorPay", razorPayRoute);
app.use("/premiumUser", premiumRoute);
app.use("/password", forgotPassRoute);

app.use((req, res) => {
  console.log(req.url);
  res.send("Hello from express");
});

//one to many
User.hasMany(Expense);
Expense.belongsTo(User);
//one to many
User.hasMany(ResetPass);
ResetPass.belongsTo(User);
//one to many
User.hasMany(FileLink);
FileLink.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Sequelize sync failed");
    console.log(err);
  });
