//Request needs to have isNewDoc (Boolean) to find out if the doc to be saved is new or not

const handleSaveDocs = async (req, res, User, Docs) => {
  const { message, text, user, isNewDoc } = req.body;
  const { username } = user;

  const userData = await User.findOne({ username });
  const userId = await userData._id;

  //If doc is new

  if (isNewDoc) {
    try {
      const saveDoc = new Docs({
        message,
        text,
        users: [userId],
      });

      const savedDoc = await saveDoc.save();

      const userSaveStatus = await User.findByIdAndUpdate(
        userId,
        { $push: { docs: savedDoc._id } },
        (error, success) => {
          if (error) {
            console.log(error);
            return res.status(500).send(err);
          } else {
            console.log("Success Saving Doc");
          }
        }
      );
      return res.json(userSaveStatus);
    } catch (err) {
      return res.json(err);
    }
  } //else {

  //   try {
  //     const docsSaveStatus = await Docs.findByIdAndUpdate(
  //       { users: userId },
  //       {
  //         message,
  //         text,
  //       },
  //       (error, success) => {
  //         if (error) {
  //           console.log(error);
  //           return res.status(500).send("Problem Saving Doc");
  //         } else {
  //           console.log("Success Saving Doc");
  //           return res.json({ response: success });
  //         }
  //       }
  //     );
  //     const docId = docsSaveStatus._id;
  //   }

  //   }

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
