const mongoose = require("mongoose");

// where is simple id
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

  tags: [
    {
      type: String,
    },
  ],

  filter: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
