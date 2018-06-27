import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../../styles/Colors";

const Header = ({ text, className }) => <h2 className={className}>{text}</h2>;

Header.defaultProps = {
  text: "Header Text",
  color: "#000000"
};

Header.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string
};

const HeaderWithStyles = styled(Header)`
  margin-bottom: 30px;
  color: ${props => props.color || Colors.text.normal};
`;

export default HeaderWithStyles;
