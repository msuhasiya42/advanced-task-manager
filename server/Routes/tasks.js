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

// router.get("/", getAllUsers);
router.post("/createTask", createTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);
router.get("/fetchTasksByUserId/:id", fetchTask);
router.get("/getTaskById/:id", getTaskById);
// router.get("/getUserById/:id", getUserById);

// Implement other routes for updating, deleting, etc.

module.exports = router;
