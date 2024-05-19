// routes/comments.js
const express = require("express");
const router = express.Router();

const {
  getComments,
  addComment,
  addReply,
  addReaction,
  deleteComment,
  deleteReply,
  deleteReaction,
} = require("../Controllers/commentController");

router.get("/task/:taskId", getComments);
router.post("/task/:taskId/add", addComment);
router.post("/:commentId/reply/add", addReply);
router.post("/:commentId/reaction/add", addReaction);
router.delete("/:commentId/delete", deleteComment);
router.delete("/replies/:replyId/delete", deleteReply);
router.delete("/reactions/:reactionId/delete", deleteReaction);

module.exports = router;
