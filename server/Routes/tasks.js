// routes/users.js
const express = require("express");
const router = express.Router();

const { createTask, updateTask } = require("../Controllers/taskController");

// router.get("/", getAllUsers);
router.post("/createTask", createTask);
router.post("/updateTask", updateTask);
// router.get("/getUserById/:id", getUserById);

// Implement other routes for updating, deleting, etc.

module.exports = router;
