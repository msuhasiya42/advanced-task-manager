const mongoose = require("mongoose");

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

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    // required: true,
  },

  tags: [tagSchema], // Use the Tag schema here

  filter: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
