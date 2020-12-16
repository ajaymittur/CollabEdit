import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
  if (sessionStorage.getItem("token") !== null) return true;
  else return false;
};

function ProtectedRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={(location) => {
        if (isAuthenticated()) return children;
        else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default ProtectedRoute;
