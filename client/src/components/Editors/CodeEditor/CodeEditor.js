import axios from "axios";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-php";
import { Slate, withReact } from "slate-react";
import { Text, createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { EditorPaper, EditorSaveButton, EditorTitle, EditorToolbar } from "../EditorComponents";
import { css } from "emotion";
import io from "socket.io-client";
import "./prism.css";
import { ENDPOINT } from "../../../routes/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "black",
  },
  whiteColor: {
    color: "white",
  },
}));

const initialValue = [
  {
    children: [
      {
        text: "",
      },
    ],
  },
];

let socket = undefined;

function CodeEditor({ groupId, readOnly }) {
  const savedValue = JSON.parse(sessionStorage.getItem("content"));
  const savedLanguage = sessionStorage.getItem("language");
  const savedTitle = sessionStorage.getItem("title");
  const [value, setValue] = useState(savedValue || initialValue);
  const [title, setTitle] = useState(savedTitle || groupId);
  const [language, setLanguage] = useState(savedLanguage || "javascript");
  const [copyStatus, setCopyStatus] = useState("Copy Invite Code");
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const classes = useStyles();

  const GETSINGLECODE = `/code/${groupId}`;

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", groupId);

    socket.on("new-code-value", (newValue) => {
      Transforms.deselect(editor);
      setValue(newValue);
    });

    socket.on("new-code-title", (newTitle) => {
      setTitle(newTitle);
    });

    socket.on("new-code-language", (newLanguage) => {
      setLanguage(newLanguage);
    });

    async function fetchData() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(GETSINGLECODE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          setValue(response.data.value);
          setTitle(response.data.title);
          setLanguage(response.data.language);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (!savedValue) fetchData();

    return () => {
      sessionStorage.removeItem("title");
      sessionStorage.removeItem("content");
      sessionStorage.removeItem("language");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      sessionStorage.setItem("content", JSON.stringify(value));
      sessionStorage.setItem("title", title);
      sessionStorage.setItem("language", language);
    }, 3000);

    return () => clearTimeout(autoSave);
  }, [value, title, language]);

  const handleValueChange = (value) => {
    setValue(value);
    socket.emit("new-code-value", groupId, value);
  };

  const handleTitleChange = (title) => {
    setTitle(title);
    socket.emit("new-code-title", groupId, title);
  };
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    socket.emit("new-code-language", groupId, lang);
  };

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (!Text.isText(node)) {
        return ranges;
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language]);
      let start = 0;

      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== "string") {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }

        start = end;
      }

      return ranges;
    },
    [language]
  );

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(groupId);
    setCopyStatus("Copied!");
  };

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={handleValueChange}
        className={classes.color}
      >
        <EditorToolbar>
          <Select
            classes={{
              root: classes.whiteColor,
              icon: classes.whiteColor,
            }}
            labelId="langSelector"
            id="langSelect"
            value={language}
            disabled={readOnly}
            onChange={(e) => handleLanguageChange(e.target.value)}>
            <MenuItem value="javascript">Javascript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C/C++</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="bash">Bash</MenuItem>
            <MenuItem value="dart">Dart</MenuItem>
            <MenuItem value="php">PHP</MenuItem>
          </Select>
          <EditorTitle
            groupId={groupId}
            value={title}
            disabled={readOnly}
            handleChange={handleTitleChange}
          />
          <EditorCopyButton
            handleCopyClipboard={handleCopyClipboard}
            copyStatus={copyStatus}
            disabled={readOnly}
          />
          <EditorSaveButton
            title={title}
            value={value}
            language={language}
            ENDPOINT={`/code/${groupId}`}
            disabled={readOnly}
          />
        </EditorToolbar>
        <EditorPaper
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Start writing..."
          readOnly={readOnly}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault();
              editor.insertText("    ");
              return;
            }
          }}
          spellCheck
          autoFocus
        />
      </Slate>
    </>
  );
}

const getLength = (token) => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return token.content.reduce((l, t) => l + getLength(t), 0);
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      className={css`
        font-family: monospace;
        background: hsla(0, 0%, 100%, 0.5);
        ${leaf.comment &&
        css`
          color: slategray;
        `}
        ${(leaf.operator || leaf.url) &&
        css`
          color: #9a6e3a;
        `}
        ${leaf.keyword &&
        css`
          color: #07a;
        `}
        ${(leaf.variable || leaf.regex) &&
        css`
          color: #e90;
        `}
        ${(leaf.number ||
          leaf.boolean ||
          leaf.tag ||
          leaf.constant ||
          leaf.symbol ||
          leaf.attr ||
          leaf.selector) &&
        css`
          color: #905;
        `}
        ${leaf.punctuation &&
        css`
          color: #999;
        `}
        ${(leaf.string || leaf.char) &&
        css`
          color: #690;
        `}
        ${(leaf.function || leaf.class) &&
        css`
          color: #dd4a68;
        `}
      `}
    >
      {children}
    </span>
  );
};

export default CodeEditor;
