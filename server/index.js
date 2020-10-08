require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authenticate = require("./middleware/authenticateToken");

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

// ROUTES

app.get("/", (req, res) => {
  console.log("Home!");
});

//Sign Up
app.post("/signup", userController.handleSignup);

//Log In
app.post("/login", userController.handleLogin);

// Get Docs
app.get("/docs", authenticate.authenticateToken, documentController.handleGetDocs);

// Create/Update Doc
app.put("/docs/:groupId", authenticate.authenticateToken, documentController.handleSaveDocs);

// Delete Doc
app.delete("/docs/:groupId", authenticate.authenticateToken, documentController.handleDeleteDoc);

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
