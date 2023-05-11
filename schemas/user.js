const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Users", userSchema);
