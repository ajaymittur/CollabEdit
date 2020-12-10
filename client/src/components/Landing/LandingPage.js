import React from "react";
import NavBar from "./NavBar";
import "./styles.css";
import { withRouter } from "react-router-dom";
import Body from "./Body";
import Details from "./Details";
import Animation from "./Animation";

function LandingPage() {
    document.title = "CollabEdit | Home ";
  
    return (
      <div>
        <NavBar />
        <Animation />
        <Details />
        <Body />
      </div>
    );
  }
  
  export default withRouter(LandingPage);