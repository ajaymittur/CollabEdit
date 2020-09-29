require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./models/generateToken");

const app = express();

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

app.listen(process.env.PORT || 4000, () => {
  console.log("Working on Port 4000");
});
