import React from "react";
import ReactDOM from "react-dom";
import { Editable } from "slate-react";
import { Button, Icon, Toolbar, AppBar, Paper } from "@material-ui/core";

export const EditorButton = React.forwardRef(
  ({ className, active, reversed, icon, ...props }, ref) => (
    <Button color={active ? "secondary" : "inherit"} {...props} ref={ref}>
      <Icon>{icon}</Icon>
    </Button>
  )
);

export const EditorPaper = React.forwardRef(({ ...props }, ref) => (
  <Paper elevation={3} style={{ padding: "10px" }}>
    <Editable {...props} ref={ref} />
  </Paper>
));

export const EditorValue = React.forwardRef(({ className, value, ...props }, ref) => {
  const textLines = value.document.nodes
    .map((node) => node.text)
    .toArray()
    .join("\n");
  return (
    <div ref={ref} {...props}>
      <div>Slate's value as text</div>
      <div>{textLines}</div>
    </div>
  );
});

export const EditorIcon = React.forwardRef(({ className, icon, ...props }, ref) => (
  <Icon {...props} ref={ref}>
    {icon}
  </Icon>
));

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div {...props} ref={ref} />
));

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export const EditorToolbar = React.forwardRef(({ className, ...props }, ref) => (
  <AppBar position="static">
    <Toolbar variant="dense" {...props} ref={ref} />
  </AppBar>
));
