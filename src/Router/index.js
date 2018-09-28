import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
//Containers
import MyForms from "../containers/Forms/FormsList/index";
import NewForm from "../containers/Forms/Create/index";
import FormDetails from "../containers/Forms/Details/index";
import Profile from "../containers/User/Profile/index";
import NoMatch from "../components/molecules/NoMatch";

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
