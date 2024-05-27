const Comment = require("../Models/comment");
const Task = require("../Models/task");

// Add a comment to a task
const addComment = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { content, authorId } = req.body;

        // Create a new comment
        const newComment = new Comment({ content, author: authorId });
        await newComment.save();

        // Populate the necessary fields for the author
        const populatedComment = await newComment.populate({
            path: 'author',
            select: 'name email picture'
        });

        // Find the task and add the new comment to it
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.comments.push(newComment._id);
        await task.save();

        // Broadcast the new comment to all connected clients
        // req.io.emit('newComment', { comment: populatedComment });

        // Send the response with the populated comment
        res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error: error.message || error });
    }
};

const getComments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate({
            path: 'comments',
            populate: [
                { path: 'author', select: 'name email picture' },
                {
                    path: 'replies',
                    populate: { path: 'author', select: 'name email picture' }
                },
                { path: 'reactions.user', select: 'name email picture' }
            ],
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message || error });
    }
};
  
  // Add a reply to a comment
  const addReply = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content, authorId } = req.body;
        const newReply = new Comment({ content, author: authorId });
        const populatedReply = await newReply.populate({
            path: 'author',
            select: 'name email picture'
        });
        await newReply.save();
  
        const comment = await Comment.findById(commentId);
        comment.replies.push(newReply._id);
        await comment.save();

        // req.io.emit('newReply', { reply: populatedReply }); // Broadcast the new reply to all connected clients

        res.status(201).json({ message: 'Reply added successfully', reply: populatedReply });
    } catch (error) {
        res.status(500).json({ message: 'Error adding reply', error });
    }
};

// Add a reaction to a comment
const addReaction = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { emoji, authorId } = req.body;
        const comment = await Comment.findById(commentId);

        const existingReaction = comment.reactions.find(
            (reaction) => reaction.user.toString() === authorId && reaction.emoji === emoji
        );

        if (existingReaction) {
            // Remove existing reaction
            comment.reactions = comment.reactions.filter(
                (reaction) => !(reaction.user.toString() === authorId && reaction.emoji === emoji)
            );
        } else {
            // Add new reaction
            comment.reactions.push({ emoji, user: authorId });
        }

        await comment.save();
        // req.io.emit('reactionUpdated', { commentId, comment }); // Broadcast the reaction update to all connected clients

        res.status(200).json({ message: 'Reaction updated successfully', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error adding reaction', error });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        // Delete the comment
        await Comment.findByIdAndDelete(commentId);
        // Remove the comment from the task's comments array
        await Task.updateOne({}, { $pull: { comments: commentId } });

        // req.io.emit('commentDeleted', commentId); // Broadcast the deleted comment ID to all connected clients

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};

// Edit a comment
const editComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { content } = req.body;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (!comment.author.equals(req.user._id)) {
        return res.status(403).json({ message: 'You do not have permission to edit this comment' });
      }
  
      comment.content = content;
      await comment.save();
  
      const populatedComment = await comment.populate({
        path: 'author',
        select: 'name email picture'
      });

      // req.io.emit('commentUpdated', {comment: populatedComment}); // Broadcast the updated comment to all connected clients

      res.status(200).json({ message: 'Comment updated successfully', comment: populatedComment });
    } catch (error) {
      console.error('Error editing comment:', error);
      res.status(500).json({ message: 'Error editing comment', error: error.message || error });
    }
};
  
// Edit a reply
const editReply = async (req, res) => {
    try {
      const replyId = req.params.replyId;
      const { content } = req.body;
  
      const reply = await Comment.findById(replyId);
      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }
  
      if (!reply.author.equals(req.user._id)) {
        return res.status(403).json({ message: 'You do not have permission to edit this reply' });
      }
  
      reply.content = content;
      await reply.save();
  
      const populatedReply = await reply.populate({
        path: 'author',
        select: 'name email picture'
      });

      // req.io.emit('replyUpdated', {reply: populatedReply}); // Broadcast the updated reply to all connected clients
  
      res.status(200).json({ message: 'Reply updated successfully', reply: populatedReply });
    } catch (error) {
      console.error('Error editing reply:', error);
      res.status(500).json({ message: 'Error editing reply', error: error.message || error });
    }
};

// Delete a reply
const deleteReply = async (req, res) => {
    try {
      const { replyId } = req.params;
      // Delete the reply
      await Comment.findByIdAndDelete(replyId);

      // req.io.emit('replyDeleted', replyId); // Broadcast the deleted reply ID to all connected clients
      res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reply", error });
    }
};

// Delete a reaction
const deleteReaction = async (req, res) => {
    try {
      const { reactionId } = req.params;
      // Delete the reaction
      await Comment.updateOne({}, { $pull: { reactions: { _id: reactionId } } });

      // req.io.emit('reactionDeleted', reactionId); // Broadcast the deleted reaction ID to all connected clients
      res.status(200).json({ message: "Reaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reaction", error });
    }
};

  module.exports = {
    getComments,
    addComment,
    addReply,
    addReaction,
    editComment,
    deleteComment,
    deleteReaction,
    editReply,
    deleteReply
  };