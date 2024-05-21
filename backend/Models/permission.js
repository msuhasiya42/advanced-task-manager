const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permissionType: {
      type: String,
      enum: ['read', 'edit'],
      required: true,
    },
  });

module.exports = { permissionSchema }