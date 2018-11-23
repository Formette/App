import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Title = styled.h3`
  color: ${props => (props.color ? props.color : props.theme.text.normal)};
`;

Title.defaultProps = {
  text: "Text"
};

Title.propTypes = {
  color: PropTypes.string,
  theme: PropTypes.object
};

export default Title;
