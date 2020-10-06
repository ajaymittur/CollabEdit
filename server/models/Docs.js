const mongoose = require("mongoose");
const autoIncrement = require("mongodb-autoincrement");

require("dotenv").config({ path: "../.env" });

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
});

autoIncrement.initialize(mongoose.connection);
DocsSchema.plugin(autoIncrement.plugin, {
  model: "Docs",
  field: "_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("Docs", DocsSchema);
