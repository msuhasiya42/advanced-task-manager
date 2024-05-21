const Task = require('../Models/task');

const canEditTask = async (req, res, next) => {
    const { taskId } = req.params;
    const userId = req.user._id; // assuming req.user is populated with the current logged-in user

    try {
        const task = await Task.findById(taskId).populate('collaborators.user');
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const isOwner = task.user.equals(userId);
        const isCollaborator = task.collaborators.some(collab => collab.user.equals(userId) && collab.permissionType === 'edit');

        if (isOwner || isCollaborator) {
            return next();
        } else {
            return res.status(403).json({ error: 'You do not have permission to edit this task' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const canViewTask = async (req, res, next) => {
    const { taskId } = req.params;
    const userId = req.user._id; // assuming req.user is populated with the current logged-in user

    try {
        const task = await Task.findById(taskId).populate('collaborators.user');
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const isOwner = task.user.equals(userId);
        const isCollaborator = task.collaborators.some(collab => collab.user.equals(userId));

        if (isOwner || isCollaborator) {
            return next();
        } else {
            return res.status(403).json({ error: 'You do not have permission to view this task' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    canEditTask,
    canViewTask,
};
