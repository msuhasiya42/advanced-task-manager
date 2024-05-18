// routes/index.js
const express = require("express");
const router = express.Router();

const usersRouter = require("./usersRoute");
const tasksRouter = require("./tasksRoute");

router.get("/", (req, res) => {
    res.send("Server Working!");
})

router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);

module.exports = router;
