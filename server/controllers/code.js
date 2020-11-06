const User = require("../models/User");
const Code = require("../models/Code");

const saveCode = async (req, res) => {
  const { username, title, value, language } = req.body;
  const { groupId } = req.params;

  const user = await User.findOne({ username });
  const userId = user._id;

  try {
    const modifiedCode = await Code.findById(groupId);

    if (!modifiedCode.editors.includes(userId))
      return res.status(400).send("User doesn't have perms to save code");

    modifiedCode.value = value;
    modifiedCode.title = title;
    modifiedCode.language = langauge;
    modifiedCode.saved_on = Date.now;
    await modifiedCode.save();

    res.send(`Code ${groupId} updated`);
  } catch (DocumentNotFoundError) {
    const newCode = new Docs({
      _id: groupId,
      title,
      value,
      language,
      owner: userId,
      editors: [userId],
    });
    user.code.push(groupId);

    await newCode.save();
    await user.save();

    res.send(`Code ${groupId} saved`);
  }
};

const getSingleCode = async (req, res) => {
  const { groupId } = req.params;

  const code = await Code.findById(groupId);

  res.json(code);
};

const getCode = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  const code = await Code.find(
    { _id: { $in: user.code } },
    "title created_on saved_on"
  ).sort({ saved_on: "desc" });

  res.json(code);
};

const getSharedCode = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  const userId = user._id;
  const sharedCode = await Code.find(
    { editors: userId, owner: { $ne: userId } },
    "title created_on saved_on"
  ).sort({ saved_on: "desc" });

  res.json(sharedCode);
};

const deleteCode = async (req, res) => {
  const { username } = req.body;
  const { groupId } = req.params;

  Code.deleteOne({ _id: groupId }, async (err) => {
    if (err) res.status(500).json(err);

    await User.findOneAndUpdate({ username }, { $pull: { code: groupId } });

    getCode(req, res);
  });
};

const addCodeEditor = async (req, res) => {
  const { editor, username } = req.body;
  const { groupId } = req.params;

  const code = await Code.findById(groupId);
  const user = await User.findOne({ username }, "_id");
  const userId = user._id;
  if (!code.owner.equals(userId))
    return res.status(401).send(`${username} doesn't own this code`);

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!_editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;

  if (code.editors.indexOf(editorId) > -1)
    return res.status(400).send(`${editor} is already an editor`);

  code.editors.push(editorId);
  await code.save();

  res.status(200).send(`${editor} made an editor`);
};

const removeCodeEditor = async (req, res) => {
  const { editor, username } = req.body;
  const { groupId } = req.params;

  const code = await Code.findById(groupId);
  const user = await User.findOne({ username });
  const userId = user._id;
  if (!code.owner.equals(userId))
    return res.status(401).send("User doesn't own this code");

  const _editor = await User.findOne({ username: editor }, "_id");
  if (!_editor) return res.status(400).send(`${editor} doesn't exist`);
  const editorId = _editor._id;
  if (editorId.equals(userId))
    return res.status(400).send("Cannot remove owner from editors");

  await code.updateOne({ $pull: { editors: editorId } });

  res.send(`Removed ${editor}`);
};

const getCodeEditors = async (req, res) => {
  const { groupId } = req.params;

  const code = await Code.findById(groupId);
  if (!code) return res.status(400).send("No such code exists");
  const editors = await User.find({ _id: { $in: code.editors } }, "username");

  editors.forEach((val, i) => (editors[i] = editors[i].username));
  res.json(editors);
};

module.exports = {
  saveCode,
  getCode,
  getSharedCode,
  getSingleCode,
  deleteCode,
  addCodeEditor,
  removeCodeEditor,
  getCodeEditors,
};
