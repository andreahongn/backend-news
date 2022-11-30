const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  user: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: String,
});
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
