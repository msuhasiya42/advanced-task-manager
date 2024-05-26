const Task = require("../Models/task");

// Controller for creating a new task
const createTask = async (req, res) => {
  try {
    const createdBy = req.user._id; // Assuming you have user information stored in the request object

    // Create a new task object
    const newTask = new Task({
      ...req.body,
      createdBy,
      updatedBy: createdBy,
    });

    // Save the task to the database
    const task = await newTask.save();

    res.status(200).json({ success: true, message: "Task added", task: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch tasks of user
const fetchTask = async (req, res) => {
  const userId = req.params.id;

  try {
    const tasks = await Task.find({
      $or: [
        { user: userId },
        { 'collaborators.user': userId }
      ]
    }).populate([
      {
        path: 'collaborators.user',
        select: 'name _id picture email' // Specify the fields to retrieve for collaborators
      },
      {
        path: 'tags' // Populate the tags field without specifying select
      }
    ]);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Controller for updating a task
const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body.task;
    const updatedBy = req.user._id; // Assuming you have user information stored in the request object

    updatedTask.updatedBy = updatedBy;

    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
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

// Get task by id
const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId).populate({
      path: 'comments',
      populate: { path: 'author replies reactions.user' },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task fetched successfully", task: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const addCollaborator = async (req, res) => {
  const { taskId } = req.params;
  const { userId, permissionType } = req.body;

  try {
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user already exists as a collaborator
      const existingCollaborator = task.collaborators.find(collab => collab.user.equals(userId));
      if (existingCollaborator) {
          return res.status(400).json({ error: 'User is already a collaborator' });
      }

      task.collaborators.push({ user: userId, permissionType });
      await task.save();

      res.status(200).json({ message: 'Collaborator added successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
};


// Remove a collaborator from a task
const removeCollaborator = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  try {
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      task.collaborators = task.collaborators.filter(collab => !collab.user.equals(userId));
      await task.save();

      res.status(200).json({ message: 'Collaborator removed successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  createTask,
  updateTask,
  fetchTask,
  getTaskById,
  deleteTask,
  addCollaborator,
  removeCollaborator
};
