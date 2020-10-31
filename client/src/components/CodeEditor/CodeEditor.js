import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";

function CodeEditor() {
  let history = useHistory();

  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const { groupId } = useParams();
  const location = useLocation();
  //const classes = useStyles();
  const [code, setCode] = useState("");

  return <></>;
}

export default CodeEditor;
