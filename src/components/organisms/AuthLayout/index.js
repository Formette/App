import React from "react";
import PropTypes from "prop-types";
//Components
import { Header, SubTitle } from "../../atoms";
//Styles
import styled from "styled-components";

const AuthLayout = ({ className, title, description, children }) => {
  return (
    <div className={`container ${className}`}>
      <form className="form-signin">
        <Header>{title}</Header>
        <SubTitle>{description}</SubTitle>
        {children}
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
  children: PropTypes.any,
  className: PropTypes.string
};

export default styled(AuthLayout)`
  padding: 150px 0;
  h2 {
    color: ${props => props.theme.text.primary};
  }
  h5 {
    color: ${props => props.theme.text.secondary};
    margin-bottom: 25px;
    line-height: 30px;
    font-size: 22px;
  }
  .form-signin {
    max-width: 420px;
    padding: 15px;
    margin: 0 auto;
  }
  @media (max-width: 576px) {
    padding: 86px 0;
  }
`;
