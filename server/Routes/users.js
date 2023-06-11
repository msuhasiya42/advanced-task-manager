// routes/users.js
const express = require("express");
const router = express.Router();

const {
  getUserById,
  createUser,
  login,
} = require("../Controllers/userController");

// router.get("/", getAllUsers);
router.post("/signup", createUser);
router.post("/login", login);
router.get("/getUserById/:id", getUserById);

// Implement other routes for updating, deleting, etc.

module.exports = router;
