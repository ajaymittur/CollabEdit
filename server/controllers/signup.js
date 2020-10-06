const handleSignup = async (req, res, bcrypt, User, generate) => {
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
};

module.exports = {
  handleSignup,
};
