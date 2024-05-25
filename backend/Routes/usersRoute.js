// routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");

const {
  getUserById,
  createUser,
  login,
  googleLogin,
  getAllUserNamesAndIds,
  deleteUser,
  updatePhoto,
  updateFilter,
} = require("../Controllers/userController");

// Public Routes
router.post("/signup", createUser);
router.post("/login", login);
router.post("/googleLoginApi", googleLogin);

// Routes requires authentication
router.use(auth);
router.put("/update/photo/:id", updatePhoto);
router.put("/update/filter/:id", updateFilter);
router.delete("/delete/:id", deleteUser);
router.get("/getById/:id", getUserById);
router.get("/getAllUsers", getAllUserNamesAndIds)

module.exports = router;
