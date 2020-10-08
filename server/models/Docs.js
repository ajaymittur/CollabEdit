const mongoose = require("mongoose");

//Create Docs Schema

const DocsSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
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
});

module.exports = mongoose.model("Docs", DocsSchema);
