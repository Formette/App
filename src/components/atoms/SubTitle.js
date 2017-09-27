import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";

const SubTitle = ({ text, className }) => <h6 className={className}>{text}</h6>;

SubTitle.defaultProps = {
  text: "Header Text",
  color: "#000000"
};

SubTitle.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string
};

const SubTitleWithStyles = styled(SubTitle)`
  color: ${props => props.color || Colors.text.normal};
`;

export default SubTitleWithStyles;
