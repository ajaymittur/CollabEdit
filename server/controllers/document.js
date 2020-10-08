const handleSaveDocs = async (req, res, User, Docs) => {
  const {
    user: { username },
    value,
  } = req.body;
  const { groupId } = req.params;

  const user = await User.findOne({ username });
  const userId = user._id;

  try {
    const modifiedDoc = await Docs.findById(groupId);
    modifiedDoc.value = value;

    await modifiedDoc.save();

    res.send(`Document ${groupId} updated`);
  } catch (DocumentNotFoundError) {
    const newDoc = new Docs({ _id: groupId, value, owner: userId });
    user.docs.push(groupId);

    await newDoc.save();
    await user.save();

    res.send(`Document ${groupId} saved`);
  }
};

const handleGetDocs = async (req, res, User, Docs) => {
  const {
    user: { username },
  } = req.body;

  const user = await User.findOne({ username });
  const docs = await Docs.find({ _id: { $in: user.docs } });

  res.json(docs);
};

const handleDeleteDoc = async (req, res, User, Docs) => {
  const {
    user: { username },
  } = req.body;
  const { groupId } = req.params;

  const user = await User.findOne({ username });

  Docs.deleteOne({ _id: groupId }, async (err) => {
    if (err) res.status(500).json(err);

    const index = user.docs.indexOf(groupId);
    if (index > -1) user.docs.splice(index, 1);

    await user.save();

    res.json(user.docs);
  });
};

module.exports = {
  handleSaveDocs,
  handleGetDocs,
  handleDeleteDoc,
};
