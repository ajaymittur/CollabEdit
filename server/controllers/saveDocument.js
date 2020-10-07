const handleSaveDocs = async (req, res, User, Docs) => {
  const { message, text, user } = req.body;
  const { username } = user;

  const userData = await User.findOne({ username });
  const userId = await userData._id;
  console.log(userId);

  // const docsSaveStatus = await Docs.findOneAndUpdate(
  //   { userId },
  //   {
  //     $push: {
  //       docs: {
  //         message,
  //         text,
  //       },
  //     },
  //   },
  //   (error, success) => {
  //     if (error) {
  //       console.log(error);
  //       return res.status(500).send("Problem Saving Doc");
  //     } else {
  //       console.log("Success Saving Doc");
  //       return res.json({ response: success.savedDocs.slice(-1)[0] });
  //     }
  //   }
  // );

  // const userSaveStatus = await User.findOneAndUpdate(
  //   { username },
  //   {
  //     $push: {
  //       docs: {
  //         message,
  //         text,
  //       },
  //     },
  //   },
  //   (error, success) => {
  //     if (error) {
  //       console.log(error);
  //       return res.status(500).send("Problem Saving Doc");
  //     } else {
  //       console.log("Success Saving Doc");
  //       return res.json({ response: success.savedDocs.slice(-1)[0] });
  //     }
  //   }
  // );
};

module.exports = {
  handleSaveDocs,
};
