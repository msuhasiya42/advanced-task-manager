// routes/index.js
const express = require("express");
const router = express.Router();
const socket = require('../socket'); // Import the socket module


const usersRouter = require("./usersRoute");
const tasksRouter = require("./tasksRoute");
const commentsRouter = require("./commentsRoute");
const tagsRouter = require("./tagsRoute");

// Middleware to attach io object to the request object
// router.use((req, res, next) => {
//     req.io = socket.getIO(); // Get the initialized io object from the socket module
//     next();
// });

router.get("/", (req, res) => {
    res.send("Server Working!");
})

router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);
router.use("/comments", commentsRouter);
router.use("/tags", tagsRouter);

module.exports = router;
