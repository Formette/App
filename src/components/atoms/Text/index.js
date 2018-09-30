import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const TextWithStyles = styled.p`
  color: ${props => props.color || props.theme.text.secondary};
`;

Text.defaultProps = {
  text: "Description Text",
  color: "#000000"
};

Text.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string
};

export default TextWithStyles;
