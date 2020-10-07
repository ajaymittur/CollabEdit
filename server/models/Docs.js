const mongoose = require("mongoose");

//Create Docs Schema

const DocsSchema = mongoose.Schema({
  save_date: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Docs", DocsSchema);
