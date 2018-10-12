import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const TextWithStyles = styled.p`
  color: ${props =>
    props.highlight
      ? props.theme.color.primary
      : props.danger
        ? props.theme.color.red
        : props.color || props.theme.text.secondary};
  font-weight: ${props => props.highlight && "bold"};
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
