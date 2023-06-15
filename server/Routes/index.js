// routes/index.js
const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const tasksRouter = require("./tasks");

// const productsRouter = require("./products");

router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);
// router.use("/products", productsRouter);

module.exports = router;
