import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Textarea = styled.textarea`
  border-radius: ${props => props.theme.radius};
  border: 1px solid ${props => props.theme.color.border};
  box-shadow: ${props => props.theme.boxShadow};
  margin: 10px 0 10px 0;
  padding: 0.7rem 0.75rem;
`;

Textarea.defaultProps = {
  placeholder: "Some text"
};

Textarea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  theme: PropTypes.object
};

export default Textarea;
