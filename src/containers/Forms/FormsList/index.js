import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";
//Containers
import MyForms from "./MyForms";
//hocs
import { withUser } from "../../../hocs";

const FormsList = ({ user }) => {
  return <MyForms userId={user.state.profile.id} />;
};

FormsList.propTypes = {
  user: PropTypes.object.isRequired
};

export default compose(withUser)(FormsList);
