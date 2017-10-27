import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";

const Error = (props) =>
  props.show ? <p className={props.className}>{props.children}</p> : null;

Error.defaultProps = {
  children: "Text"
};

Error.propTypes = {
  children: PropTypes.any.isRequired
};

const ErrorWithStyles = styled(Error)`color: ${Colors.red} !important;`;

export default ErrorWithStyles;
