import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";

import RichTextEditor from "./RichTextEditor";
import { GETEDITORS, ADDEDITOR, REMOVEEDITOR } from "../../../routes";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

function TextEditor() {
  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const { groupId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [addEditor, setAddEditor] = useState();
  const [removeEditor, setRemoveEditor] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(GETEDITORS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.data.includes(username)) setReadOnly(true);
        else setReadOnly(false);
      } catch (err) {
        console.error(err);
        setReadOnly(true);
      }
      if (location.state && location.state.newDoc) setReadOnly(false);
    }
    fetchData();
  }, []);

  const handleAddEditor = async () => {
    try {
      await axios.post(
        ADDEDITOR,
        { editor: addEditor },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError(null);
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      setError(err.response.data);
    }
  };

  const handleRemoveEditor = async () => {
    try {
      // for some reason the axios delete alias (axios.delete) doesn't pass {data: {editor: removeEditor}} to the body
      await axios({
        method: "delete",
        url: REMOVEEDITOR,
        data: {
          editor: removeEditor,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setError(null);
      setOpenRemove(false);
    } catch (err) {
      console.error(err);
      setError(err.response.data);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push("/dashboard")}
          >
            Back
          </Button>
          <Typography variant="h6" className={classes.title}>
            {username}
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            disabled={readOnly}
          >
            Editor
          </Button>
          <Dialog
            open={openAdd}
            onClose={() => {
              setError(null);
              setOpenAdd(false);
            }}
          >
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To allow others with the link to edit, please enter the editor's
                username here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Editor to Add"
                onChange={(e) => setAddEditor(e.target.value)}
                fullWidth
              />
              {error && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setError(null);
                  setOpenAdd(false);
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleAddEditor} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            color="inherit"
            startIcon={<RemoveIcon />}
            onClick={() => setOpenRemove(true)}
            disabled={readOnly}
          >
            Editor
          </Button>
          <Dialog
            open={openRemove}
            onClose={() => {
              setError(null);
              setOpenRemove(false);
            }}
          >
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To revoke an editor's permission to edit the doc, please enter
                the editor's username here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Editor to Remove"
                onChange={(e) => setRemoveEditor(e.target.value)}
                fullWidth
              />
              {error && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setError(null);
                  setOpenRemove(false);
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleRemoveEditor} color="primary">
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
      <RichTextEditor groupId={groupId} readOnly={readOnly} />
    </>
  );
}

export default TextEditor;
