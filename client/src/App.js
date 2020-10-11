import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginForm from "./components/LoginForm/LoginForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import NotFound from "./components/NotFound/NotFound";
import TextEditor from "./components/TextEditor/TextEditor";
import Dashboard from "./components/Dashboard/Dashboard";

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
        <Route path="/groups/:groupId">
          <TextEditor />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
