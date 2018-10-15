import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Loadable from "react-loadable";
//Components
import { Loader } from "../components/molecules/index";
//Containers
/*import MyForms from "../containers/Forms/FormsList/index";
import NewForm from "../containers/Forms/Create/index";
import FormDetails from "../containers/Forms/Details/index";
import Profile from "../containers/User/Profile/index";
import NoMatch from "../components/molecules/NoMatch";*/

function Loading({ error, retry, pastDelay }) {
  if (error) {
    return (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (pastDelay) {
    return <Loader />;
  } else {
    return null;
  }
}

const MyForms = Loadable({
  loader: () => import("../containers/Forms/FormsList"),
  loading: Loading
});

const NewForm = Loadable({
  loader: () => import("../containers/Forms/Create"),
  loading: Loading,
  delay: 300
});

const FormDetails = Loadable({
  loader: () => import("../containers/Forms/Details"),
  loading: Loading,
  delay: 1000
});

const Profile = Loadable({
  loader: () => import("../containers/User/Profile"),
  loading: Loading,
  delay: 1000
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
      <PrivateRoute exact path="/edit/:id" component={NewForm} {...props} />
      <PrivateRoute exact path="/form/:id" component={FormDetails} {...props} />
      <PrivateRoute exact path="/profile" component={Profile} {...props} />
      <PrivateRoute component={NoMatch} />
    </Switch>
  </main>
);

export default Main;
