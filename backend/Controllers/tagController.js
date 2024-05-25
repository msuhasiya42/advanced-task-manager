const Tag = require('../Models/tag');
const User = require('../Models/user');
const Task = require('../Models/task');

// Controller to handle adding a new tag
const addTag = async (req, res) => {
  try {
    const { userId, name, color } = req.body;
    const tag = new Tag({ name, color });
    await tag.save();

    await User.findByIdAndUpdate(userId, { $push: { tags: tag } });

    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller to handle updating an existing tag
const updateTag = async (req, res) => {
  try {
    const { userId, name, color } = req.body;
    const { id } = req.params;

    const tag = await Tag.findByIdAndUpdate(id, { name, color }, { new: true });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Update tag references in user and task schemas
    await Promise.all([
      User.updateMany(
        { _id: userId, 'tags._id': id },
        { $set: { 'tags.$': tag } }
      ),
      Task.updateMany(
        { 'tags._id': id },
        { $set: { 'tags.$': tag } }
      ),
    ]);

    res.json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller to handle deleting a tag
const deleteTag = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await Promise.all([
      User.updateMany(
        { _id: userId, 'tags._id': id },
        { $pull: { tags: { _id: id } } }
      ),
      Task.updateMany(
        { 'tags._id': id },
        { $pull: { tags: { _id: id } } }
      ),
    ]);

    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addTag, updateTag, deleteTag };
