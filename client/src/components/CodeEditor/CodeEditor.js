import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import Editor from "react-simple-code-editor";
import axios from "axios";
import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { highlight, languages } from "prismjs/components/prism-core";
import { makeStyles } from "@material-ui/core/styles";
import { css } from "emotion";
import {
  EditorButton,
  EditorLinkButton,
  EditorPaper,
  EditorSaveButton,
  EditorTitle,
  EditorToolbar,
} from "../TextEditor/EditorComponents";
import { ENDPOINT } from "../../routes/routes";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function CodeEditor() {
  let history = useHistory();

  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const { groupId } = useParams();
  const location = useLocation();
  const classes = useStyles();
  const [code, setCode] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [addEditor, setAddEditor] = useState();
  const [removeEditor, setRemoveEditor] = useState();
  const [error, setError] = useState();
  const [language, setLanguage] = useState("html");
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <>
      <Editor
        value={code}
        onValueChange={(codes) => setCode(codes)}
        highlight={(codes) => highlight(codes, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </>
  );
}

export default CodeEditor;
