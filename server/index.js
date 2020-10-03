require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./models/generateToken");

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new-value", (newValue) => {
    socket.broadcast.emit("new-remote-value", newValue);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Home!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json("Incorrect Login");

  const accessToken = generate.generateToken(req.body);

  res.json({ accessToken });

  console.log("Log In");
});

app.post("/signup", (req, res) => {
  console.log("Sign Up");
});

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
