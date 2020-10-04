import React, { useCallback, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import isHotkey from "is-hotkey";
import isUrl from "is-url";
import { useParams } from "react-router-dom";
import { withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, Range, createEditor } from "slate";
import { withHistory } from "slate-history";

import {
  EditorButton,
  EditorLinkButton,
  EditorToolbar,
  EditorPaper,
  EditorSaveButton,
} from "./EditorComponents";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const ENDPOINT = "http://localhost:4000/";

let socket = undefined;

function RichTextEditor() {
  const saved = JSON.parse(localStorage.getItem("content"));
  const { groupId } = useParams();
  const [value, setValue] = useState(saved || initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on(`new-value-${groupId}`, (newValue) => {
      setValue(newValue);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      localStorage.setItem("content", JSON.stringify(value));
    }, 3000);
    return () => clearTimeout(autoSave);
  }, [value]);

  const handleChange = (value) => {
    setValue(value);
    socket.emit("new-value", groupId, value);
  };

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <EditorToolbar>
        {[
          ["bold", "format_bold"],
          ["italic", "format_italic"],
          ["underline", "format_underlined"],
          ["code", "code"],
        ].map(([format, icon]) => (
          <MarkButton format={format} icon={icon} />
        ))}
        <LinkButton format="link" icon="link" />
        {[
          ["heading-one", "looks_one"],
          ["heading-two", "looks_two"],
          ["heading-three", "looks_3"],
          ["block-quote", "format_quote"],
          ["numbered-list", "format_list_numbered"],
          ["bulleted-list", "format_list_bulleted"],
        ].map(([format, icon]) => (
          <BlockButton format={format} icon={icon} />
        ))}
        <EditorSaveButton editor={editor} ENDPOINT={ENDPOINT} />
      </EditorToolbar>
      <EditorPaper
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Start writing..."
        spellCheck
        autoFocus
        onKeyDown={(event) => {
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

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={icon}
    />
  );
};

const LinkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <EditorLinkButton
      active={isBlockActive(editor, format)}
      editor={editor}
      toggleLink={toggleLink}
      icon={icon}
    />
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      icon={icon}
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
