require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const auth = require("./middleware/authenticateToken");

const userController = require("./controllers/user");
const documentController = require("./controllers/document");
const codeController = require("./controllers/code");

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new-doc-value", (groupId, newValue) => {
    socket.broadcast.emit(`new-doc-value-${groupId}`, newValue);
  });

  socket.on("new-doc-title", (groupId, newTitle) => {
    socket.broadcast.emit(`new-doc-title-${groupId}`, newTitle);
  });

  socket.on("new-code-value", (groupId, newValue) => {
    socket.broadcast.emit(`new-code-value-${groupId}`, newValue);
  });

  socket.on("new-code-title", (groupId, newTitle) => {
    socket.broadcast.emit(`new-code-title-${groupId}`, newTitle);
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

// Get Shared Docs
app.get(
  "/docs/shared",
  auth.authenticateToken,
  documentController.getSharedDocs
);

// Get Single Docs
app.get(
  "/docs/:groupId",
  auth.authenticateToken,
  documentController.getSingleDoc
);

// Create/Update Doc
app.put("/docs/:groupId", auth.authenticateToken, documentController.saveDocs);

// Delete Doc
app.delete(
  "/docs/:groupId",
  auth.authenticateToken,
  documentController.deleteDoc
);

// Add Doc Editor
app.post(
  "/docs/:groupId/addEditor",
  auth.authenticateToken,
  documentController.addEditor
);

// Remove Doc Editor
app.delete(
  "/docs/:groupId/removeEditor",
  auth.authenticateToken,
  documentController.removeEditor
);

// Get Doc Editors
app.get(
  "/docs/:groupId/editors",
  auth.authenticateToken,
  documentController.getEditors
);

// --------------Code---------------

// Get Code
//app.get("/code", auth.authenticateToken, codeController.getCode);

// Get Shared Code
// app.get(
//   "/code/shared",
//   auth.authenticateToken,
//   codeController.getSharedDocs
// );

// Get Single Code
// app.get(
//   "/code/:groupId",
//   auth.authenticateToken,
//   codeController.getSingleDoc
// );

// Create/Update Code
//app.put("/code/:groupId", auth.authenticateToken, codeController.saveDocs);

// Delete Code
// app.delete(
//   "/code/:groupId",
//   auth.authenticateToken,
//   codeController.deleteDoc
// );

// Add Code Editor
// app.post(
//   "/code/:groupId/addEditor",
//   auth.authenticateToken,
//   codeController.addEditor
// );

// Remove Code Editor
// app.delete(
//   "/code/:groupId/removeEditor",
//   auth.authenticateToken,
//   codeController.removeEditor
// );

// Get Code Editors
// app.get(
//   "/code/:groupId/editors",
//   auth.authenticateToken,
//   codeController.getEditors
// );

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
