const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json("Incorrect Login");

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) return res.status(400).json("User Doesnt Exist");

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) return res.status(400).send("Invalid Password");
  } catch (err) {
    return res.status(500).json(err);
  }

  const token = generateToken(req.body);
  console.log("Logged In!");
  const response = {
    username,
    token,
  };
  return res.json(response);
};

const handleSignup = async (req, res) => {
  const { name, username, email, dob, password } = req.body;

  if (!username || !password) return res.status(400).json("Incorrect Signup");

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
      if (existingUser) return res.status(400).json("User Already Exists");
      const savedUser = await user.save();
      console.log(savedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json("Invalid Token/Password");
  }

  const token = generateToken(req.body);
  console.log("Signed Up!");
  const response = {
    name,
    email,
    username,
    dob,
    token,
  };
  return res.json(response);
};

module.exports = {
  handleLogin,
  handleSignup,
};
