import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Text = styled.p`
  color: ${props =>
    props.highlight
      ? props.theme.color.primary
      : props.danger
        ? props.theme.color.red
        : props.color || props.theme.text.secondary};
  font-weight: ${props => props.highlight && "bold"};
`;

Text.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  theme: PropTypes.object,
  highlight: PropTypes.bool
};

export default Text;
