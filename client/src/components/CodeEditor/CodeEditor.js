import Prism from "prismjs";
import PrismCode from "react-prism";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "./prism.css";

const useStyles = makeStyles((theme) => ({
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
  const [langname, setLangname] = useState("javascript");
  const [code, setCode] = useState("");

  Prism.highlightAll();

  return (
    <>
      <div>
        {" "}
        <Select
          labelId="langSelector"
          id="langSelect"
          value={langname}
          onChange={(e) => setLangname(e.target.value)}
        >
          <MenuItem value="javascript">Javascript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="c">C</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
          <MenuItem value="java">Java</MenuItem>
        </Select>
      </div>
      <PrismCode className={`language-${langname}`}>
        {/* <TextField value={code} onChange={(e) => setCode(e.target.value)} /> */}
      </PrismCode>
    </>
  );
}

export default CodeEditor;
