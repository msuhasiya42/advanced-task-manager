// routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const {canEditTask} = require("../Middlewares/taskAuthorization");

const {
  createTask,
  updateTask,
  fetchTask,
  deleteTask,
  getTaskById,
  addCollaborator,
  removeCollaborator
} = require("../Controllers/taskController");

// private routes for tasks
router.use(auth)
router.post("/add", createTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/getByUserId/:id", fetchTask);
router.get("/getTaskById/:id", getTaskById);

// needs change
router.post('/:taskId/collaborators/add', canEditTask, addCollaborator);
router.delete('/:taskId/collaborators/remove', canEditTask, removeCollaborator);

module.exports = router;
