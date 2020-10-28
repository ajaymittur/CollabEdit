import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import LoginForm from "./components/LoginForm/LoginForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import NotFound from "./components/NotFound/NotFound";
import TextEditor from "./components/TextEditor/TextEditor";
import CodeEditor from "./components/CodeEditor/CodeEditor";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/">
          <Redirect to="/dashboard" />
        </ProtectedRoute>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/signup">
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <Route path="/groups/:groupId">
          <TextEditor />
        </Route>
        <Route path="/codeEditor">
          <CodeEditor />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
