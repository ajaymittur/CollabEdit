const mongoose = require("mongoose");

//Create Code Schema

const CodeSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_on: {
    type: Date,
    default: Date.now,
  },
  saved_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Code", CodeSchema);
