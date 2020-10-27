const User = require("../models/User");
const Docs = require("../models/Docs");

const saveDocs = async (req, res) => {
  const { username, title, value } = req.body;
  const { groupId } = req.params;

  const user = await User.findOne({ username });
  const userId = user._id;

  try {
    const modifiedDoc = await Docs.findById(groupId);

    if (!modifiedDoc.editors.includes(userId))
      return res.status(400).send("User doesn't have perms to save doc");

    modifiedDoc.value = value;
    modifiedDoc.title = title;
    modifiedDoc.saved_on = Date.now;
    await modifiedDoc.save();

    res.send(`Document ${groupId} updated`);
  } catch (DocumentNotFoundError) {
    const newDoc = new Docs({
      _id: groupId,
      title,
      value,
      //saved_on: Date.now,
      owner: userId,
      editors: [userId],
    });
    user.docs.push(groupId);

    await newDoc.save();
    await user.save();

    res.send(`Document ${groupId} saved`);
  }
};

const getSingleDoc = async (req, res) => {
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);

  res.json(doc);
};

const getDocs = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  const docs = await Docs.find({ _id: { $in: user.docs } }, "title created_on");

  res.json(docs);
};

const getSharedDocs = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  const userId = user._id;
  const sharedDocs = await Docs.find(
    { editors: userId, owner: { $ne: userId } },
    "title created_on"
  ).sort({ saved_on: "desc" });

  res.json(sharedDocs);
};

const deleteDoc = async (req, res) => {
  const { username } = req.body;
  const { groupId } = req.params;

  Docs.deleteOne({ _id: groupId }, async (err) => {
    if (err) res.status(500).json(err);

    await User.findOneAndUpdate({ username }, { $pull: { docs: groupId } });

    getDocs(req, res);
  });
};

const addEditor = async (req, res) => {
  const { editor, username } = req.body;
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  const user = await User.findOne({ username }, "_id");
  const userId = user._id;
  if (!doc.owner.equals(userId))
    return res.status(401).send(`${username} doesn't own this doc`);

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!_editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;

  if (doc.editors.indexOf(editorId) > -1)
    return res.status(400).send(`${editor} is already an editor`);

  doc.editors.push(editorId);
  await doc.save();

  res.status(200).send(`${editor} made an editor`);
};

const removeEditor = async (req, res) => {
  const { editor, username } = req.body;
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  const user = await User.findOne({ username });
  const userId = user._id;
  if (!doc.owner.equals(userId))
    return res.status(401).send("User doesn't own this doc");

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!_editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;
  if (editorId.equals(userId))
    return res.status(400).send("Cannot remove owner from editors");

  await doc.updateOne({ $pull: { editors: editorId } });

  res.send(`Removed ${editor}`);
};

const getEditors = async (req, res) => {
  const { groupId } = req.params;

  const doc = await Docs.findById(groupId);
  if (!doc) return res.status(400).send("No such doc exists");
  const editors = await User.find({ _id: { $in: doc.editors } }, "username");

  editors.forEach((val, i) => (editors[i] = editors[i].username));

  res.json(editors);
};

module.exports = {
  saveDocs,
  getDocs,
  getSharedDocs,
  getSingleDoc,
  deleteDoc,
  addEditor,
  removeEditor,
  getEditors,
};
