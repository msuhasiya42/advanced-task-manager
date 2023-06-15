// routes/users.js
const express = require("express");
const router = express.Router();

const { createTask } = require("../Controllers/taskController");

// router.get("/", getAllUsers);
router.post("/create-task", createTask);
// router.get("/getUserById/:id", getUserById);

// Implement other routes for updating, deleting, etc.

module.exports = router;
