const Expense = require("../model/expense");
const { Op } = require("sequelize");

exports.getIsPremium = async (req, res) => {
  try {
    const response = req.user.isPremium;
    // console.log(response);
    res.status(200).send({ isPremium: response });
  } catch (error) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  // console.log("userId>>>>>", userId);
  try {
    const response = await Expense.findAll({
      attributes: ["amount", "description", "category"],
      where: { userId: { [Op.ne]: userId } },
    });
    // console.log("Response>>>>>>>", response);
    res.status(200).send({ expenses: response, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};
