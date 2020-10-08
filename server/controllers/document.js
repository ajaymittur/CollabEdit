const User = require("../models/User");
const Docs = require("../models/Docs");

const saveDocs = async (req, res) => {
  const {
    user: { username },
    title,
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
    const newDoc = new Docs({ _id: groupId, title, value, owner: userId });
    user.docs.push(groupId);

    await newDoc.save();
    await user.save();

    res.send(`Document ${groupId} saved`);
  }
};

const getDocs = async (req, res) => {
  const {
    user: { username },
  } = req.body;

  const user = await User.findOne({ username });
  const docs = await Docs.find({ _id: { $in: user.docs } });

  res.json(docs);
};

const deleteDoc = async (req, res) => {
  const {
    user: { username },
  } = req.body;
  const { groupId } = req.params;

  Docs.deleteOne({ _id: groupId }, async (err) => {
    if (err) res.status(500).json(err);

    const user = await User.findOneAndUpdate(
      { username },
      { $pull: { docs: groupId } },
      { new: true }
    );

    res.json(user.docs);
  });
};

const addEditor = async (req, res) => {
  const {
    editor,
    user: { username },
  } = req.body;
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  const user = await User.findOne({ username }, "_id");
  const userId = user._id;
  if (!doc.owner.equals(userId)) return res.status(401).send("User doesn't own this doc");

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;

  if (doc.editors.indexOf(editorId) > -1)
    return res.status(200).send(`${editor} is already an editor`);

  doc.editors.push(editorId);
  await doc.save();

  res.status(200).send(`${editor} made an editor`);
};

const removeEditor = async (req, res) => {
  const {
    editor,
    user: { username },
  } = req.body;
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  const user = await User.findOne({ username });
  const userId = user._id;
  if (!doc.owner.equals(userId)) return res.status(401).send("User doesn't own this doc");

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;

  await doc.updateOne({ $pull: { editors: editorId } });

  res.send(`Removed ${editor}`);
};

const getEditors = async (req, res) => {
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  const editors = await User.find({ _id: { $in: doc.editors } }, "username");

  editors.forEach((val, i) => (editors[i] = editors[i].username));

  res.json(editors);
};

module.exports = {
  saveDocs,
  getDocs,
  deleteDoc,
  addEditor,
  removeEditor,
  getEditors,
};
