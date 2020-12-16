import axios from "axios";
import isHotkey from "is-hotkey";
import isUrl from "is-url";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import { createEditor, Editor, Range, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Slate, useSlate, withReact } from "slate-react";
import io from "socket.io-client";

import {
  EditorButton,
  EditorLinkButton,
  EditorPaper,
  EditorSaveButton,
  EditorTitle,
  EditorToolbar,
} from "../EditorComponents";
import { ENDPOINT } from "../../../routes/routes";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

let socket = undefined;

function RichTextEditor({ groupId, readOnly }) {
  const savedValue = JSON.parse(sessionStorage.getItem("content"));
  const savedTitle = sessionStorage.getItem("title");
  const [value, setValue] = useState(savedValue || initialValue);
  const [title, setTitle] = useState(savedTitle || groupId);
  const [copyStatus, setCopyStatus] = useState("Copy Invite Code");
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);

  const GETSINGLEDOC = `/docs/${groupId}`;

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on(`new-doc-value-${groupId}`, (newValue) => {
      Transforms.deselect(editor);
      setValue(newValue);
    });

    socket.on(`new-doc-title-${groupId}`, (newTitle) => {
      setTitle(newTitle);
    });

    async function fetchData() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(GETSINGLEDOC, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          setValue(response.data.value);
          setTitle(response.data.title);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (!savedValue) fetchData();

    return () => {
      sessionStorage.removeItem("title");
      sessionStorage.removeItem("content");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      sessionStorage.setItem("content", JSON.stringify(value));
      sessionStorage.setItem("title", title);
    }, 3000);

    return () => clearTimeout(autoSave);
  }, [value, title]);

  const handleValueChange = (value) => {
    setValue(value);
    socket.emit("new-doc-value", groupId, value);
  };

  const handleTitleChange = (title) => {
    setTitle(title);
    socket.emit("new-doc-title", groupId, title);
  };
  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(groupId);
    setCopyStatus("Copied!");
  };

  return (
    <Slate editor={editor} value={value} onChange={handleValueChange}>
      <EditorToolbar>
        {[
          ["bold", "format_bold"],
          ["italic", "format_italic"],
          ["underline", "format_underlined"],
          ["code", "code"],
        ].map(([format, icon]) => (
          <MarkButton format={format} icon={icon} disabled={readOnly} />
        ))}
        <LinkButton format="link" icon="link" disabled={readOnly} />
        {[
          ["heading-one", "looks_one"],
          ["heading-two", "looks_two"],
          ["heading-three", "looks_3"],
          ["block-quote", "format_quote"],
          ["numbered-list", "format_list_numbered"],
          ["bulleted-list", "format_list_bulleted"],
        ].map(([format, icon]) => (
          <BlockButton format={format} icon={icon} disabled={readOnly} />
        ))}
        <EditorTitle
          groupId={groupId}
          value={title}
          disabled={readOnly}
          handleChange={handleTitleChange}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ width: "15%", marginRight: "1%" }}
          onClick={() => handleCopyClipboard()}
        >
          {copyStatus}
        </Button>
        <EditorSaveButton
          title={title}
          value={value}
          ENDPOINT={`/docs/${groupId}`}
          disabled={readOnly}
        />
      </EditorToolbar>
      <EditorPaper
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Start writing..."
        spellCheck
        autoFocus
        readOnly={readOnly}
        onKeyDown={(event) => {
          if (isHotkey("tab", event)) {
            event.preventDefault();
            editor.insertText("    ");
            return;
          }
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
}

const withLinks = (editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const wrapLink = (editor, url) => {
  if (isBlockActive(editor, "link")) {
    Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const toggleLink = (editor, url, isActive) => {
  if (!isActive) {
    if (editor.selection && url) {
      wrapLink(editor, url);
    }
  } else {
    Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
  }
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote {...attributes} style={{ borderLeft: "2px solid #ddd", paddingLeft: "10px" }}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "link":
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon, disabled }) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={icon}
      disabled={disabled}
    />
  );
};

const LinkButton = ({ format, icon, disabled }) => {
  const editor = useSlate();
  return (
    <EditorLinkButton
      active={isBlockActive(editor, format)}
      editor={editor}
      toggleLink={toggleLink}
      icon={icon}
      disabled={disabled}
    />
  );
};

const MarkButton = ({ format, icon, disabled }) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      icon={icon}
      disabled={disabled}
    />
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default RichTextEditor;
