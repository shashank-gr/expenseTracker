const Expense = require("../model/expense");

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    res.status(200).send({ expenses, msg: "Success, all expenses fetched" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};
exports.postAddExpense = async (req, res) => {
  // console.log(req.body);
  const { amount, description, category } = req.body;
  if (amount == "" || description == "" || category == "") {
    return res.status(400).send({ msg: "Enter all input fields" });
  }
  try {
    const expense = await req.user.createExpense({
      amount,
      description,
      category,
    });
    res.status(201).send({ expense, msg: "success, added expense" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const expenses = await req.user.getExpenses({ where: { id } });
    expenses[0].destroy();
    res.status(200).send({ msg: "deleted from DB" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};
