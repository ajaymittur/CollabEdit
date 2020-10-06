require("dotenv").config();

const express = require("express");
const cors = require("cors");
//const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./controllers/generateToken");
const User = require("./models/User");
const signin = require("./controllers/signin");
const login = require("./controllers/login");

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
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB!")
);
mongoose.set("useCreateIndex", true);

//ROUTES

app.get("/", (req, res) => {
  console.log("Home!");
});

//Sign Up

app.post("/signup", async (req, res) => {
  signin.handleSignin(req, res, bcrypt, User, generate);
});

//Log In

app.post("/login", async (req, res) => {
  login.handleLogin(req, res, bcrypt, User, generate);
});

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
