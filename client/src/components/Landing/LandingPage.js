import React from "react";
import Landing from "./Landing";
import "./styles.css";
import { withRouter } from "react-router-dom";
import Animation from "./Animation";

function LandingPage() {
    document.title = "CollabEdit | Home ";
  
    return (
      <div>
        <Landing />
        <Animation />
      </div>
    );
  }
  
  export default withRouter(LandingPage);