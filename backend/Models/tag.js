const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: "#2196F3",
    },
});

module.exports = { tagSchema };