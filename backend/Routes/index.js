// routes/index.js
const express = require("express");
const router = express.Router();

const usersRouter = require("./usersRoute");
const tasksRouter = require("./tasksRoute");
const commentsRouter = require("./commentsRoute");
const tagsRouter = require("./tagsRoute");


router.get("/", (req, res) => {
    res.send("Server Working!");
})

router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);
router.use("/comments", commentsRouter);
router.use("/tags", tagsRouter);

module.exports = router;
