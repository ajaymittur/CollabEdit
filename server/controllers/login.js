const handleLogin = async (req, res, bcrypt, User, generate) => {
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

  const token = generate.generateToken(req.body);
  console.log("Logged In!");
  const response = {
    username,
    token,
  };
  return res.json(response);
};

module.exports = {
  handleLogin,
};
