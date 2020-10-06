require("dotenv").config();

const express = require("express");
const cors = require("cors");
//const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authenticate = require("./middleware/authenticateToken");
const generate = require("./controllers/generateToken");
const User = require("./models/User");
const Docs = require("./models/Docs");
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

app.post("/savedocs", authenticate.authenticateToken, async (req, res) => {
  const message = "TITLE";
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a tempor lectus. Fusce nec nisl tempus, elementum metus eget, sollicitudin tortor. Mauris vel mi vulputate, sollicitudin nulla eu, consectetur mauris. Mauris tincidunt sollicitudin facilisis. In sem tellus, volutpat vitae justo ac, congue tincidunt magna. Phasellus molestie ut massa eget tincidunt. Etiam facilisis sodales maximus. Proin at purus et ex feugiat lacinia. Phasellus malesuada velit bibendum felis mollis imperdiet. Nam vulputate quam sit amet laoreet ultrices. Aenean molestie ut ante vel pellentesque. Mauris mi ante, rutrum ultrices tortor nec, finibus elementum felis. In metus mauris, sollicitudin non nunc dignissim, ornare efficitur augue.";
  const values = { message, text };

  User.findOneAndUpdate(
    { username: req.body.username },
    { $push: { savedDocs: values } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    }
  );
});

http.listen(process.env.PORT || 4000, () => {
  console.log("Listening on Port 4000");
});
