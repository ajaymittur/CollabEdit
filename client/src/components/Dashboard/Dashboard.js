import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DescriptionIcon from "@material-ui/icons/Description";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { useJupiterListItemStyles } from "@mui-treasury/styles/listItem/jupiter";
import { v4 as uuidv4 } from "uuid";

import { ENDPOINT, GETDOCS, GETSHAREDDOCS } from "../../routes/routes";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  buttonSpacing: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Dashboard() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const history = useHistory();
  const classes = useStyles();
  const listClasses = useJupiterListItemStyles();
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [shared, setShared] = useState([]);
  const [drawerStyles, setDrawerStyles] = useState(classes.drawer + " " + classes.drawerClose);
  const [paperStyles, setPaperStyles] = useState(classes.drawerClose);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const myDocs = await axios.get(GETDOCS, {
          headers: { Authorization: `Bearer ${token}` },
          data: { username: username },
        });

        if (!myDocs.data) throw Error(`Null response from ${GETDOCS}`);
        setDocs(myDocs.data);

        const sharedDocs = await axios.get(GETSHAREDDOCS, {
          headers: { Authorization: `Bearer ${token}` },
          data: { username: username },
        });

        if (!sharedDocs.data) throw Error(`Null response from ${GETSHAREDDOCS}`);
        setShared(sharedDocs.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (open) {
      setDrawerStyles(`${classes.drawer} ${classes.drawerOpen}`);
      setPaperStyles(classes.drawerOpen);
    } else {
      setDrawerStyles(`${classes.drawer} ${classes.drawerClose}`);
      setPaperStyles(classes.drawerClose);
    }
  }, [open]);

  const toggleOpen = () => (open ? setOpen(false) : setOpen(true));
  const handleSignOut = () => {
    localStorage.clear();
    history.push("/login");
  };
  const deleteDoc = async (id) => {
    try {
      const response = await axios.delete(`${ENDPOINT}/docs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });
      setDocs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const docsList = docs.map(({ _id: id, title, created_on }) => (
    <ListItem key={id}>
      <ListItemText primary={title} secondary={Date(created_on)} />
      <ListItemIcon>
        <IconButton
          className={classes.buttonSpacing}
          onClick={() => history.push({ pathname: `/groups/${id}`, state: { newDoc: false } })}>
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => deleteDoc(id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemIcon>
    </ListItem>
  ));

  const sharedDocsList = shared.map(({ _id: id, title, created_on }) => (
    <ListItem
      button
      onClick={() => history.push({ pathname: `/groups/${id}`, state: { newDoc: false } })}
      key={id}>
      <ListItemText primary={title} secondary={Date(created_on)} />
      <ListItemIcon>
        <KeyboardArrowRightIcon className={classes.buttonSpacing} />
      </ListItemIcon>
    </ListItem>
  ));

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={toggleOpen}
            edge="start"
            className={classes.buttonSpacing}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {username}
          </Typography>
          <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={drawerStyles}
        classes={{
          paper: paperStyles,
        }}>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem
            classes={listClasses}
            button
            selected={selectedIndex === 0}
            onClick={(e) => setSelectedIndex(0)}>
            <ListItemIcon>
              <DescriptionIcon color={selectedIndex === 0 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="My Docs" />
          </ListItem>
          <ListItem
            classes={listClasses}
            button
            selected={selectedIndex === 1}
            onClick={(e) => setSelectedIndex(1)}>
            <ListItemIcon>
              <FolderSharedIcon color={selectedIndex === 1 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Shared With Me" />
          </ListItem>
          <ListItem
            classes={listClasses}
            button
            onClick={() =>
              history.push({ pathname: `/groups/${uuidv4()}`, state: { newDoc: true } })
            }>
            <ListItemIcon>
              <AddIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Create New Doc" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {selectedIndex === 0 && <List>{docsList}</List>}
        {selectedIndex === 1 && <List>{sharedDocsList}</List>}
      </main>
    </div>
  );
}

export default Dashboard;
