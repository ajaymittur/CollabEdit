import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'sans-serif',
    fontSize: 12,
    fontWeightLight: 10,
  },

});

export default function FontSizeTheme() {
  return (
    <ThemeProvider theme={theme}>
      <Typography style={{marginLeft: "37%", fontStyle: "italic", marginTop: "3%", color: "#424242"}}>
            Interactive and multi-language supported <br/>
            code editor which allows multiple developers<br/>
            to code at once and debug each other's code
      </Typography>
      <Typography style={{marginLeft: "7%", fontStyle: "italic", marginTop: "16%", color: "#424242"}}>
            Real-time collaborative text editor which<br/>
            allows multiple people of the same party to edit,<br/>
            create and manipulate documents on the cloud
      </Typography>
      <Typography style={{marginLeft: "65%", fontStyle: "italic", marginTop: "6.5%", color: "#424242"}}>
            Documents on the cloud can be accessed by the<br/>
            collaborators from any part of the world
      </Typography>
    </ThemeProvider>
  );
}
