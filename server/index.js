require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./controllers/generateToken");
const User = require("./models/User");
const Docs = require("./models/Docs");
const signin = require("./controllers/signup");
const login = require("./controllers/login");
const saveDocument = require("./controllers/saveDocument");

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new-value", (groupId, newValue) => {
    socket.broadcast.emit(`new-value-${groupId}`, newValue);
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

//ROUTES

app.get("/", (req, res) => {
  console.log("Home!");
});

//Sign Up

app.post("/signup", async (req, res) => {
  signin.handleSignup(req, res, bcrypt, User, generate);
});

//Log In

app.post("/login", async (req, res) => {
  login.handleLogin(req, res, bcrypt, User, generate);
});

//Saving a Document

app.post("/savedocs", authenticate.authenticateToken, async (req, res) => {
  saveDocument.handleSaveDocs(req, res, User, Docs);
});

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
