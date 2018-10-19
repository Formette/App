// @flow
import React from "react";
import { compose } from "react-apollo";
//Containers
import MyForms from "./MyForms";
//hocs
import { withUser } from "../../../hocs";

const FormsList = ({ user }) => {
  return <MyForms userId={user.state.profile.id} />;
};

export default compose(withUser)(FormsList);
