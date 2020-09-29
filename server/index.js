const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Home!");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json("Incorrect Login");

  console.log("Log In");
});

app.post("/signup", (req, res) => {
  console.log("Sign Up");
});

app.listen(4000, () => {
  console.log("Working on Port 4000");
});
