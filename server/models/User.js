const mongoose = require("mongoose");

// Create UserSchema

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
  dob: {
    type: Date,
    required: true,
  },
  docs: [
    {
      type: String,
      ref: "Docs",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
