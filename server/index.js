const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Home!");
});

app.post("/login", (req, res) => {
  console.log("Log In");
});

app.post("/signup", (req, res) => {
  console.log("Sign Up");
});

app.listen(3000, () => {
  console.log("Working on Port 3000");
});
