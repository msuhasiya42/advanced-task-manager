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
    const task = await newTask.save();

    res.status(200).json({ success: true, message: "Task added ", task: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// fetch tasks of user
const fetchTask = async (req, res) => {
  try {
    const user = req.params.id;
    // get task based on user id
    const tasks = await Task.find({ user: user });

    // return list of task in json form
    // @Remember
    // sending new task we to show new task on front end side
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
    const updatedTask = req.body;
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
  try {
    // @Remember
    // Find the task by its ID and remove it
    const deletedTask = await Task.findByIdAndRemove(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// get task by id
const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task fetched successfully", task: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, updateTask, fetchTask, getTaskById, deleteTask };
