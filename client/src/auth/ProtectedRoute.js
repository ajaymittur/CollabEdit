import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
  if (localStorage.getItem("token") !== null) return true;
  else return false;
};

export const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(location) => {
        if (isAuthenticated()) return children;
        else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                //state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
};
