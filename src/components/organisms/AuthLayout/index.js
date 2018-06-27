import React from "react";
import PropTypes from "prop-types";
//Components
import { Header, SubTitle } from "../../atoms";
//Styles
import styled from "styled-components";
import Colors from "../../../styles/Colors";

const AuthLayout = props => {
  return (
    <div className={`container ${props.className}`}>
      <form className="form-signin">
        <Header text={props.title} />
        <SubTitle text={props.description} />
        {props.children}
      </form>
    </div>
  );
};

AuthLayout.defaultProps = {
  title: "Formette",
  description: "Welcome back, Come quick! Your forms are waiting for you"
};

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.any
};

const AuthLayoutWithStyles = styled(AuthLayout)`
  padding: 150px 0 150px 0;
  h2 {
    color: ${Colors.text.normal};
  }
  h6 {
    color: ${Colors.text.secondary};
    margin-bottom: 25px;
    line-height: 30px;
    font-size: 22px;
  }
  .form-signin {
    max-width: 420px;
    padding: 15px;
    margin: 0 auto;
  }
`;

export default AuthLayoutWithStyles;
