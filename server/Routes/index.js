// routes/index.js
const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
// const productsRouter = require("./products");

router.use("/users", usersRouter);
// router.use("/products", productsRouter);

module.exports = router;
