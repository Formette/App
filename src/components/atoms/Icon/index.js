import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Icon = props => (
  <i className={`${props.name} ${props.className}`} style={props.style} />
);

Icon.defaultProps = {
  name: "fa-file-text-o",
  color: "#000000",
  size: 20
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.any
};

export default styled(Icon)`
  font-size: ${props => (props.size ? `${props.size}px` : "inhered")};
  color: ${props => props.color || "inhered"};
`;
