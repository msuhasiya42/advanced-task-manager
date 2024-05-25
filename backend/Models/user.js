const mongoose = require("mongoose");

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

  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],

  filter: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
