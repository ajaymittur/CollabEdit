import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import { Slate, withReact } from "slate-react";
import { Text, createEditor } from "slate";
import { withHistory } from "slate-history";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import {
  EditorPaper,
  EditorSaveButton,
  EditorTitle,
  EditorToolbar,
} from "../TextEditor/EditorComponents";
import { css } from "emotion";

import "./prism.css";

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
        text: "function lol; var x = 5;",
      },
    ],
  },
];

function CodeEditor() {
  let history = useHistory();

  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const { groupId } = useParams();
  const location = useLocation();
  const [langname, setLangname] = useState("javascript");
  const [code, setCode] = useState("");

  const [value, setValue] = useState(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const classes = useStyles();

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (!Text.isText(node)) {
        return ranges;
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[langname]);
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
    [langname]
  );

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
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
            value={langname}
            onChange={(e) => setLangname(e.target.value)}
          >
            <MenuItem value="javascript">Javascript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C/C++</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>

          <EditorTitle />
          <EditorSaveButton />
        </EditorToolbar>
        <EditorPaper
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Start writing..."
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
