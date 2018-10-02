import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Badge = ({ text, className }) => {
  return (
    <h1 className={className}>
      <span className="badge">{text}</span>
    </h1>
  );
};

Badge.defaultProps = {
  text: "Badge Text",
  bg: "#000000"
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  bg: PropTypes.string,
  className: PropTypes.string
};

export default styled(Badge)`
  span {
    background-color: ${props => props.bg || props.theme.color.primary};
  }
`;
