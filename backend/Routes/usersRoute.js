// routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");

const {
  getUserById,
  createUser,
  login,
  googleLogin,
  updateUser,
  getAllUserNamesAndIds,
  deleteUser
} = require("../Controllers/userController");

// Public Routes
router.post("/signup", createUser);
router.post("/login", login);
router.post("/googleLoginApi", googleLogin);

// Routes requires authentication
router.use(auth);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/getById/:id", getUserById);
router.get("/getAllUsers", getAllUserNamesAndIds)

module.exports = router;
