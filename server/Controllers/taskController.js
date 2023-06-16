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

// @Todo
// Controller for updating task
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    // Create a new task object
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    res.status(201).json({ success: true, task: savedTask });
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

module.exports = { createTask, updateTask, fetchTask };
