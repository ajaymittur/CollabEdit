require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = { generateToken };
