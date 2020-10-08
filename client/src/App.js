import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import LoginForm from "./components/LoginForm/LoginForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import RichTextEditor from "./components/TextEditor/RichTextEditor";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/groups/${uuidv4()}`} />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/signup">
          <SignUpForm />
        </Route>
        <Route path="/groups/:groupId" children={<RichTextEditor />} />
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

const NoMatch = () => {
  return <h1>404</h1>;
};

export default App;
