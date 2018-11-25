import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";
//Containers
import MyForms from "./MyForms";
//Components
import { Layout } from "../../../components/organisms";
//hocs
import { withUser } from "../../../hocs";

const FormsList = ({ user }) => {
  return (
    <Layout>
      <MyForms userId={user.state.profile.id} />
    </Layout>
  );
};

FormsList.propTypes = {
  user: PropTypes.object.isRequired
};

export default compose(withUser)(FormsList);
