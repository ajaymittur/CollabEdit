import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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

import RichTextEditor from "./RichTextEditor";

const ENDPOINT = "http://localhost:4000";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

function TextEditor() {
  const { groupId } = useParams();
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const [readOnly, setReadOnly] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [addEditor, setAddEditor] = useState();
  const [removeEditor, setRemoveEditor] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${ENDPOINT}/docs/${groupId}/editors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // TODO:
        // change this after @akshaymittur is done with user login
        // get username from login
        const username = "ajay";
        if (!response.data.includes(username)) setReadOnly(true);
        else setReadOnly(false);
      } catch (err) {
        console.error(err);
        setReadOnly(true);
      }
    }
    fetchData();
  }, []);

  const handleAddEditor = async () => {
    try {
      const response = await axios.put(
        `${ENDPOINT}/docs/${groupId}/addEditor`,
        { editor: addEditor },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error(err);
    }
    setOpenAdd(false);
  };

  const handleRemoveEditor = async () => {
    try {
      // for some reason the axios delete alias (axios.delete) doesn't pass {data: {editor: removeEditor}} to the body
      const response = await axios({
        method: "delete",
        url: `${ENDPOINT}/docs/${groupId}/removeEditor`,
        data: {
          editor: removeEditor,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    }
    setOpenRemove(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBackIcon />}>
            <Link to="/dashboard">Back</Link>
          </Button>
          <Typography variant="h6" className={classes.title}>
            Username
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            disabled={readOnly}>
            Editor
          </Button>
          <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To allow others with the link to edit, please enter the editor's username here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Editor to Add"
                onChange={(e) => setAddEditor(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAdd(false)} color="primary">
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
            disabled={readOnly}>
            Editor
          </Button>
          <Dialog open={openRemove} onClose={() => setOpenRemove(false)}>
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To revoke an editor's permission to edit the doc, please enter the editor's username
                here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Editor to Remove"
                onChange={(e) => setRemoveEditor(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRemove(false)} color="primary">
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
