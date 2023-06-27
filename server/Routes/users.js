// routes/users.js
const express = require("express");
const router = express.Router();

const {
  getUserById,
  createUser,
  login,
  updateUser,
} = require("../Controllers/userController");

router.post("/signup", createUser);
router.post("/login", login);
router.put("/updateUser/:id", updateUser);
router.get("/getUserById/:id", getUserById);

module.exports = router;
