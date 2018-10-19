import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Loadable from "react-loadable";
//Components
import { Loader } from "../components/molecules/index";
//Containers
import MyForms from "../containers/Forms/FormsList";
import NewForm from "../containers/Forms/Create";
/*import MyForms from "../containers/Forms/FormsList/index";
import NewForm from "../containers/Forms/Create/index";
import FormDetails from "../containers/Forms/Details/index";
import Profile from "../containers/User/Profile/index";
import NoMatch from "../components/molecules/NoMatch";*/

const Loading = ({ error, retry, pastDelay }) => {
  return error ? (
    <div>
      Error! <button onClick={retry}>Retry</button>
    </div>
  ) : pastDelay ? (
    <Loader top={100} />
  ) : null;
};

const EditForm = Loadable({
  loader: () => import("../containers/Forms/Create"),
  loading: Loading
});

const FormDetails = Loadable({
  loader: () => import("../containers/Forms/Details"),
  loading: Loading,
  delay: 1000
});

const Profile = Loadable({
  loader: () => import("../containers/User/Profile"),
  loading: Loading
});

const NoMatch = Loadable({
  loader: () => import("../components/molecules/NoMatch"),
  loading: () => null
});

const Main = props => (
  <main>
    <Switch>
      <PrivateRoute exact path="/" component={MyForms} />
      <PrivateRoute exact path="/new" component={NewForm} {...props} />
      <PrivateRoute exact path="/edit/:id" component={EditForm} {...props} />
      <PrivateRoute exact path="/form/:id" component={FormDetails} {...props} />
      <PrivateRoute exact path="/profile" component={Profile} {...props} />
      <PrivateRoute component={NoMatch} />
    </Switch>
  </main>
);

export default Main;
