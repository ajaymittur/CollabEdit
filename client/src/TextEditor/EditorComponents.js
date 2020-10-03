import React from "react";
import { Editable } from "slate-react";
import {
  Button,
  Icon,
  Toolbar,
  AppBar,
  Paper,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

export const EditorButton = React.forwardRef(
  ({ className, active, reversed, icon, ...props }, ref) => (
    <Button color={active ? "secondary" : "inherit"} {...props} ref={ref}>
      <Icon>{icon}</Icon>
    </Button>
  )
);

export const EditorLinkButton = React.forwardRef(
  ({ className, active, icon, editor, toggleLink, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [url, setUrl] = React.useState();
    const [selection, setSelection] = React.useState();

    const handleClose = () => {
      setUrl("");
      setOpen(false);
    };

    const handleEnter = () => {
      setOpen(false);
      editor.selection = selection;
      toggleLink(editor, url, active);
    };

    return (
      <>
        <Button
          color={active ? "secondary" : "inherit"}
          {...props}
          ref={ref}
          onMouseDown={() => setSelection(editor.selection)}
          onClick={() => (active ? toggleLink(editor, url, active) : setOpen(true))}>
          <Icon>{icon}</Icon>
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="url"
              label="URL"
              type="text"
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEnter} color="primary">
              Enter
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export const EditorPaper = React.forwardRef(({ ...props }, ref) => (
  <Paper elevation={3} style={{ padding: "10px 20px 10px 20px" }}>
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

export const EditorToolbar = React.forwardRef(({ className, ...props }, ref) => (
  <AppBar position="static">
    <Toolbar variant="dense" {...props} ref={ref} />
  </AppBar>
));
