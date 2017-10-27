import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";

const Text = ({ text, className }) => <p className={className}>{text}</p>;

Text.defaultProps = {
  text: "Description Text",
  color: "#000000"
};

Text.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string
};

const TextWithStyles = styled(Text)`
  color: ${(props) => props.color || Colors.text.normal};
`;

export default TextWithStyles;
