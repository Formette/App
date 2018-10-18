import React from "react";
//Context
import { UserContext } from "../context/UserContext";

// This function takes a component...
export default function withUser(Component) {
  // ...and returns another component...
  return function UserComponent(props) {
    // ... and renders the wrapped component with the context user
    // pass through any additional props as well
    return (
      <UserContext.Consumer>
        {context => <Component {...props} user={context} />}
      </UserContext.Consumer>
    );
  };
}
