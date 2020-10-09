import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import RichTextEditor from "./RichTextEditor";

const ENDPOINT = "http://localhost:4000";

function TextEditor() {
  const { groupId } = useParams();
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${ENDPOINT}/docs/${groupId}/editors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // change this after @akshaymittur is done with user login
        // get username from login
        const username = "sfsf";
        if (!response.data.includes(username)) setReadOnly(true);
        else setReadOnly(false);
      } catch (err) {
        console.error(err);
        setReadOnly(true);
      }
    }
    fetchData();
  }, []);

  return <RichTextEditor groupId={groupId} readOnly={readOnly} />;
}

export default TextEditor;
