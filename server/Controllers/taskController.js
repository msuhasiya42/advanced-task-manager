const Task = require("../Models/tasks");

// Controller for creating a new task
const createTask = async (req, res) => {
  try {
    const { title, status, user } = req.body;

    // Create a new task object
    const newTask = new Task({
      title,
      status,
      user,
    });

    // Save the task to the database
    await newTask.save();

    res.status(200).json({ success: true, message: "Task added " });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// fetch tasks of user
const fetchTask = async (req, res) => {
  try {
    const { user } = req.body;

    // get task based on user id
    const tasks = await Task.find({ user: user });

    // return list of task in json form
    res.status(200).json({ success: true, tasks: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @Todo
// Controller for updating task
const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const updatedTask = req.body;
    console.log(updatedTask);
    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//delete task
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  Task.deleteOne({ _id: ObjectId(taskId) }, (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "Failed to delete task" });
      return;
    }
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted successfully" });
  });
};

// get task by id
const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  TaskDetails.findOne({ _id: ObjectId(taskId) }, (err, task) => {
    if (err) {
      console.error("Error retrieving task:", err);
      res.status(500).json({ error: "Failed to retrieve task" });
      return;
    }
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  });
};

module.exports = { createTask, updateTask, fetchTask, getTaskById, deleteTask };
