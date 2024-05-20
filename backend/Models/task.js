const mongoose = require("mongoose");
const { tagSchema } = require('./tag');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: [tagSchema],
      default: [],
    },
    done: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["todo", "inProgress", "completed"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Urgent", "High", "Medium", "Low"],
      default: "Medium",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    attatchments: [
      {
        type: String,
      },
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
