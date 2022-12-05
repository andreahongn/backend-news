const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 31,
    trim: true,
  },

  username: {
    type: String,
    required: true,
    min: 3,
    max: 31,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    min: 8,
    max: 31,
  },

  password: {
    type: String,
    required: true,
    min: 8,
    max: 31,
  },
  role: {
    type: String,
    default: "user",
  },
  tokens: {
    type: String,
    default: "",
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
