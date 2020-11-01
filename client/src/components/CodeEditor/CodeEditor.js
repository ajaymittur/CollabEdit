import Prism from "prismjs";
import PrismCode from "react-prism";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  EditorButton,
  EditorLinkButton,
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
      {/* <PrismCode className={`language-${langname}`}> */}
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

          {/* {[
            ["bold", "format_bold"],
            ["italic", "format_italic"],
            ["underline", "format_underlined"],
            ["code", "code"],
          ].map(([format, icon]) => (
            //<MarkButton format={format} icon={icon} disabled={readOnly} />
            <MarkButton format={format} icon={icon} />
          ))} */}
          {/* <LinkButton format="link" icon="link" disabled={readOnly} /> */}
          {/* <LinkButton format="link" icon="link" />
          {[
            ["heading-one", "looks_one"],
            ["heading-two", "looks_two"],
            ["heading-three", "looks_3"],
            ["block-quote", "format_quote"],
            ["numbered-list", "format_list_numbered"],
            ["bulleted-list", "format_list_bulleted"],
          ].map(([format, icon]) => (
            // <BlockButton format={format} icon={icon} disabled={readOnly} />
            <BlockButton format={format} icon={icon} />
          ))} */}
          <EditorTitle
          // groupId={groupId}
          // value={title}
          //disabled={readOnly}
          //handleChange={handleTitleChange}
          />
          <EditorSaveButton
          // title={title}
          // value={value}
          //ENDPOINT={`${ENDPOINT}/docs/${groupId}`}
          //disabled={readOnly}
          />
        </EditorToolbar>
        <EditorPaper
          //renderElement={renderElement}
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Start writing..."
          spellCheck
          autoFocus
          // readOnly={readOnly}
          // onKeyDown={(event) => {
          //   for (const hotkey in HOTKEYS) {
          //     if (isHotkey(hotkey, event)) {
          //       event.preventDefault();
          //       const mark = HOTKEYS[hotkey];
          //       toggleMark(editor, mark);
          //     }
          //   }
          // }}
        />
        {/* <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Write some code..."
        /> */}
      </Slate>
      {/* </PrismCode> */}
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
