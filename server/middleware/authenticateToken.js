require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json("Null Token");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json("Invalid Token");
    console.log(decoded);
    req.body.username = decoded.username;
    console.log(req.body);
    next();
  });
};

module.exports = { authenticateToken };
