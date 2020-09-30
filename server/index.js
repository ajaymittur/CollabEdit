require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./controllers/generateToken");
const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB!")
);
mongoose.set("useCreateIndex", true);

app.get("/", (req, res) => {
  console.log("Home!");
});

//Log In

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json("Incorrect Login");

  try {
    const salt = bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
  } catch {
    return res.status(500).json("Invalid Password");
  }

  const token = generate.generateToken(req.body);

  res.json({ ...req.body, token });

  console.log("Log In");
});

//Sign Up

app.post("/signup", async (req, res) => {
  const { name, username, email, dob, password } = req.body;

  if (!username || !password) return res.status(400).json("Incorrect Login");

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      password: hash,
      dob,
    });

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(540).json("User Already Exists");
      const savedUser = await user.save();
    } catch (err) {
      return res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json("Invalid Token/Password");
  }

  const token = generate.generateToken(req.body);
  console.log("Signed Up!");
  const response = {
    name,
    email,
    username,
    dob,
    token,
  };
  return res.json(response);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Working on Port 4000");
});
