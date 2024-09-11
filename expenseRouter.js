const express = require("express");
const Expense = require("./expenseSchema");
const expenseRouter = express.Router();

expenseRouter.post("/create/:id", async (req, res) => {
  const expense = new Expense({
    userId: req.params.id,
    reason: req.body.reason,
    amount: req.body.amount,
    date: req.body.date,
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json({ newExpense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

expenseRouter.get("/fetch/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching expenses for user ID:", userId);
    const expenses = await Expense.find({ userId });
    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found for this user" });
    }
    res.status(200).json({ expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

expenseRouter.put("/update/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        reason: req.body.reason,
        amount: req.body.amount,
        date: req.body.date,
      },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

expenseRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const delExpense = await Expense.findByIdAndDelete(id);
    if (!delExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(delExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = expenseRouter;
