// routes/comments.js
const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");

const {
  getComments,
  addComment,
  addReply,
  addReaction,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
  deleteReaction
} = require("../Controllers/commentController");


// apply auth middleware to all
router.use(auth);

// Comments Routes
router.get("/task/:taskId", getComments);
router.post("/task/:taskId/add", addComment);
router.put("/:commentId/edit", editComment);
router.delete("/:commentId/delete", deleteComment);

// Reply Routes
router.post("/:commentId/reply/add", addReply);
router.put("/replies/:replyId/edit", editReply);
router.delete("/replies/:replyId/delete", deleteReply);

// Reaction Routes
router.post("/:commentId/reaction/add", addReaction);
router.delete("/reactions/:reactionId/delete", deleteReaction);

module.exports = router;
