require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  console.log(req.body, "before auth");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json("Null Token");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json("Invalid Token");
    req.body.username = decoded.username;
    console.log(req.body, "after auth");
    next();
  });
};

module.exports = { authenticateToken };
