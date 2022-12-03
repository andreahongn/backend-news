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
    trim: true,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 12,
  },

  password: {
    type: String,
    required: true,
    min: 8,
    max: 30,
  },
  tokens: {
    type: String,
    default: "",
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
