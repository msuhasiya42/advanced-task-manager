// routes/users.js
const express = require("express");
const router = express.Router();

const {
  createTask,
  updateTask,
  fetchTask,
} = require("../Controllers/taskController");

// router.get("/", getAllUsers);
router.post("/createTask", createTask);
router.put("/updateTask/:id", updateTask);
router.post("/fetchTask", fetchTask);
// router.get("/getUserById/:id", getUserById);

// Implement other routes for updating, deleting, etc.

module.exports = router;
