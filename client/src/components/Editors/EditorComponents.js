import React from "react";
import axios from "axios";
import { Editable } from "slate-react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "10px 20px",
  },
  drawerPaper: {
    width: 80,
  },
  saveButton: {
    marginLeft: "auto",
    marginRight: 0,
  },
  title: {
    margin: 8,
  },
  input: {
    color: "white",
  },
  disabled: {
    color: "white",
  },
}));

const EditorButton = ({ active, icon, disabled, ...props }) => (
  <Button
    color={active ? "secondary" : "inherit"}
    disabled={disabled}
    {...props}
  >
    <Icon>{icon}</Icon>
  </Button>
);

const EditorSaveButton = ({ title, value, ENDPOINT, disabled, ...props }) => {
  const [saving, setSaving] = React.useState(false);
  const classes = useStyles();

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    await axios.put(
      ENDPOINT,
      {
        title,
        value,
        language: props.language,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSaving(false);
  };

  if (saving) return <CircularProgress color="secondary" />;
  else
    return (
      <Button
        color="inherit"
        startIcon={<Icon>save</Icon>}
        onClick={handleSave}
        className={classes.saveButton}
        disabled={disabled}
      >
        Save
      </Button>
    );
};

const EditorLinkButton = ({ active, editor, toggleLink, icon, disabled }) => {
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
        onMouseDown={() => setSelection(editor.selection)}
        onClick={() =>
          active ? toggleLink(editor, url, active) : setOpen(true)
        }
        disabled={disabled}
      >
        <Icon>{icon}</Icon>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
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
};

const EditorPaper = ({ ...props }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Editable {...props} />
    </Paper>
  );
};

const EditorToolbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="sticky">
      <Toolbar variant="dense">
        <Hidden smUp>
          <Button
            color="inherit"
            onClick={handleDrawerToggle}
            startIcon={<Icon>edit</Icon>}
          >
            Format
          </Button>
          <Drawer
            anchor="top"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            PaperProps={{ square: false }}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {children}
          </Drawer>
        </Hidden>
        <Hidden xsDown>{children}</Hidden>
      </Toolbar>
    </AppBar>
  );
};

const EditorTitle = ({ groupId, value, disabled, handleChange }) => {
  const classes = useStyles();

  return (
    <TextField
      className={classes.title}
      label="Title"
      value={value === groupId ? "" : value}
      placeholder={groupId}
      variant="outlined"
      size="small"
      fullWidth
      color="secondary"
      error
      InputProps={{
        classes: {
          root: classes.input,
          disabled: classes.disabled,
        },
      }}
      disabled={disabled}
      onChange={(e) =>
        e.target.value ? handleChange(e.target.value) : handleChange(groupId)
      }
    />
  );
};

export {
  EditorButton,
  EditorLinkButton,
  EditorToolbar,
  EditorPaper,
  EditorSaveButton,
  EditorTitle,
};
