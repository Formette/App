import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Input = styled.input`
  border-radius: ${props => props.theme.radius};
  border: 1px solid ${props => props.theme.color.border};
  box-shadow: ${props => props.theme.boxShadow};
  margin: 10px 0 10px 0;
  padding: 0.7rem 0.75rem;
`;

Input.defaultProps = {
  type: "text",
  placeholder: "Some text"
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  theme: PropTypes.object,
  placeholder: PropTypes.string.isRequired
};

export default Input;
