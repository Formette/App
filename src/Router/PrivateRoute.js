import React from "react";
import { Route, Redirect } from "react-router-dom";
//Utilities
import { _isLoggedIn } from "../services/utilities";

//Verifies if the user is logggedIn, if not redirect to login page
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      _isLoggedIn() ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
