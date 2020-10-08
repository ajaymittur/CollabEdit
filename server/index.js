require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const auth = require("./middleware/authenticateToken");

const userController = require("./controllers/user");
const documentController = require("./controllers/document");

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new-value", (groupId, newValue) => {
    socket.broadcast.emit(`new-value-${groupId}`, newValue);
  });

  socket.on("new-title", (groupId, newTitle) => {
    socket.broadcast.emit(`new-title-${groupId}`, newTitle);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connected to DB!")
);
mongoose.set("useCreateIndex", true);

// -------------Users---------------

//Sign Up
app.post("/signup", userController.signup);

//Log In
app.post("/login", userController.login);

// --------------Docs---------------

// Get Docs
app.get("/docs", auth.authenticateToken, documentController.getDocs);

// Get Single Docs
app.get("/docs/:groupId", auth.authenticateToken, documentController.getSingleDoc);

// Create/Update Doc
app.put("/docs/:groupId", auth.authenticateToken, documentController.saveDocs);

// Delete Doc
app.delete("/docs/:groupId", auth.authenticateToken, documentController.deleteDoc);

// Add Editor
app.post("/docs/:groupId/addEditor", auth.authenticateToken, documentController.addEditor);

// Remove Editor
app.delete("/docs/:groupId/removeEditor", auth.authenticateToken, documentController.removeEditor);

// Get Editors
app.get("/docs/:groupId/editors", auth.authenticateToken, documentController.getEditors);

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
