import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
//Containers
import MyForms from "../containers/MyForms";
import NewForm from "../containers/NewForm";
import FormDetails from "../containers/FormDetails";
import Profile from "../containers/Profile";
import NoMatch from "../containers/NoMatch";

const Main = props => (
  <main>
    <Switch>
      <PrivateRoute exact path="/" component={MyForms} />
      <PrivateRoute exact path="/new" component={NewForm} {...props} />
      <PrivateRoute exact path="/edit/:id" component={NewForm} {...props} />
      <PrivateRoute exact path="/form/:id" component={FormDetails} {...props} />
      <PrivateRoute exact path="/profile" component={Profile} {...props} />
      <PrivateRoute component={NoMatch} />
    </Switch>
  </main>
);

export default Main;
