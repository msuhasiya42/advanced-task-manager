// routes/users.js
const express = require("express");
const router = express.Router();

const {
  getUserById,
  createUser,
  login,
  googleLogin,
  updateUser,
  verifyToken,
  getAllUserNamesAndIds,
  deleteUser
} = require("../Controllers/userController");

router.post("/signup", createUser);
router.post("/login", login);
router.post("/googleLoginApi", googleLogin);
router.post("/verifyToken", verifyToken);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getUserById/:id", getUserById);
router.get("/getAllUsers", getAllUserNamesAndIds)

module.exports = router;
