import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Error = props =>
  props.show ? <p className={props.className}>{props.children}</p> : null;

Error.defaultProps = {
  children: "Text"
};

Error.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string.isRequired,
  show: PropTypes.bool
};

export default styled(Error)`
  color: ${props => props.theme.color.red} !important;
`;
