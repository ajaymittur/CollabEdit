const handleSaveDocs = async (req, res, User) => {
  const { message, text, username } = req.body;

  const saveStatus = await User.findOneAndUpdate(
    { username: req.body.username },
    {
      $push: {
        savedDocs: {
          message,
          text,
        },
      },
    },
    (error, success) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Problem Saving Doc");
      } else {
        console.log("Success Saving Doc");
        return res.json({ response: success.savedDocs.slice(-1)[0] });
      }
    }
  );
};

module.exports = {
  handleSaveDocs,
};
