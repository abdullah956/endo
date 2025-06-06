const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../authMiddleware");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

router.post("/", async (req, res) => {
  const todo = await Todo.create({ ...req.body, userId: req.userId });
  res.json(todo);
});

router.put("/:id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(todo);
});

router.delete("/:id", async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

module.exports = router;
