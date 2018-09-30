import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import { lighten } from "polished";

const Button = styled.button`
  background: ${props =>
    props.primary ? props.theme.color.secondary : props.theme.color.default};
  color: ${props =>
    props.primary ? props.theme.color.white : props.theme.color.primary};
  box-shadow: ${props => props.theme.boxShadow};
  border: 0;
  border-radius: ${props => props.theme.radius};
  cursor: pointer;
  &:hover,
  &:active,
  &:visited {
    background: ${props =>
      props.primary
        ? lighten(0.1, props.theme.color.secondary)
        : lighten(0.1, props.theme.color.default)};
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px
      ${props =>
        props.primary
          ? lighten(0.1, props.theme.color.secondary)
          : lighten(0.1, props.theme.color.default)};
  }
  span {
    margin-left: 5px;
  }
`;

Button.defaultProps = {
  type: "button",
  children: "text"
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  color: PropTypes.string,
  textColor: PropTypes.string
};

export default Button;
