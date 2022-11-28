const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");

router.post("/addexpense", expenseController.postAddExpense);
router.get("/getExpense", expenseController.getAllExpenses);
router.delete("/deleteExpense/:id", expenseController.deleteExpense);

module.exports = router;
