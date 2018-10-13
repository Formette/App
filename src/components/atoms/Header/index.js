import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Header = styled.h2`
  margin-bottom: 30px;
  color: ${props => props.color || props.theme.text.normal};
`;

Header.defaultProps = {
  text: "Header Text",
  color: "#000000"
};

Header.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string
};

export default Header;
