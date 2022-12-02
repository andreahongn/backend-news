const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 30,
    trim: true,
  },

  username: {
    type: String,
    required: true,
    min: 3,
    max: 30,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 12,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    min: 8,
    max: 30,
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
