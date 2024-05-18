// routes/users.js
const express = require("express");
const router = express.Router();

const {
  createTask,
  updateTask,
  fetchTask,
  deleteTask,
  getTaskById,
} = require("../Controllers/taskController");

router.post("/add", createTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/getByUserId/:id", fetchTask);
router.get("/getTaskById/:id", getTaskById);

module.exports = router;
