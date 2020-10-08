const mongoose = require("mongoose");

//Create Docs Schema

const DocsSchema = mongoose.Schema({
  _id: {
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
  // editors: {} if we plan on adding controlled edit feature
  created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Docs", DocsSchema);
