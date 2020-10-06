const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

require("dotenv").config({ path: "../.env" });

const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

autoIncrement.initialize(connection);

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

DocsSchema.plugin(autoIncrement.plugin, {
  model: "Docs",
  field: "_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = {
  DocsSchema,
};
