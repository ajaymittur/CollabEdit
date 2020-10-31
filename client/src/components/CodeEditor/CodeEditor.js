import Prism from "prismjs";
import PrismCode from "react-prism";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";

import "./prism.css";

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
      <PrismCode className={`language-${langname}`}>
        {`
  onSubmit(e) {
    e.preventDefault();
    const job = {
      title: 'Developer',
      company: 'Facebook' 
      };
    }
`}
      </PrismCode>
    </>
  );
}

export default CodeEditor;
