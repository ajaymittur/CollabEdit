import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import logo1 from "./assets/icon1people.png";
import logo2 from "./assets/icon2texteditor.png";
import logo3 from "./assets/icon4edit2.png";



    const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
          boxShadow: theme.shadows[7],
          
        },
      },
    
      large2: {
        width: theme.spacing(14),
        height: theme.spacing(14),
        marginLeft: theme.spacing(-30),
        '&:hover':{
          transiton:"3s ease-out",
          width: theme.spacing(15.5),
          height: theme.spacing(15.5),
      },
      },

      large3: {
        width: theme.spacing(14),
        height: theme.spacing(14),
       marginLeft: theme.spacing(15),
        '&:hover':{
          transiton:"3s ease-out",
          width: theme.spacing(15.5),
          height: theme.spacing(15.5),
      },
      },

      large1: {
        width: theme.spacing(14),
        height: theme.spacing(14),
        marginLeft: theme.spacing(80),

        '&:hover':{
            transiton:"3s ease-out",
            width: theme.spacing(15.5),
            height: theme.spacing(15.5),
        },
      },
    }));
    
    function Body() {
      const classes = useStyles();
    
      return (
        <div className={classes.root}>    
          <Avatar spacing ml={2} style={{backgroundColor: "#0e0e0f", marginTop: "-30%"}} alt="People Collab" src={logo1} className={classes.large1} />
          <Avatar style={{backgroundColor: "#0e0e0f", marginTop: "-17%"}} alt="Text Editor" src={logo2} className={classes.large2} />
          <Avatar style={{backgroundColor: "#0e0e0f", marginTop: "-17%"}} alt="Docs" src={logo3} className={classes.large3} />
        </div>
      );
    }
    


export default Body;
