import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import logo from "./assets/icon5CollabEditLogo.png";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
    margin: theme.spacing(0),
    flexGrow: 1,
  },
},
  title: {
    flexGrow: 1,  
  },
  buttonSize: {
    marginLeft: theme.spacing(50),
  },
  logo: {
    maxWidth: 43,
  },
  buttonColor: {
    color: 'primary',
    '&:hover': {
      transition: '3s ease in',
      backgroundColor: 'black',
    },
    
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <img src={logo} style={{marginRight: "5px"}} alt="logo" className={classes.logo} />
          <Typography variant="h6" className={classes.title}>
            CollabEdit
          </Typography>
          <ButtonGroup variant="text" aria-label="text primary button group">
            <Button style={{color: "#e8eaf6"}} className={classes.buttonColor} component={Link} to="/login">Login</Button>
            <Button style={{color: "#e8eaf6"}} className={classes.buttonColor} component={Link} to="/signup">Signup</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar> 
    </div>
  );
} 
