// routes/users.js
const express = require("express");
const router = express.Router();

const { createUser, login } = require("../Controllers/userController");

// router.get("/", getAllUsers);
router.post("/signup", createUser);
router.post("/login", login);

// Implement other routes for updating, deleting, etc.

module.exports = router;
