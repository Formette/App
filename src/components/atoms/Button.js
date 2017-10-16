import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Color from "../../styles/Colors";
import { lighten } from "polished";

const Button = props => {
  const rest = Object.assign({}, props);
  delete rest.textColor;
  return (
    <button type={props.type} className={`${props.className}`} {...rest}>
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
  children: "text",
  color: Color.primary,
  textColor: Color.black
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string
};

const ButtonWithStyles = styled(Button)`
  border-radius: 0;
  background: ${props => (props.color ? props.color : Color.default)};
  color: ${(props) => (props.textColor ? props.textColor : Color.black)};
  border: 0;
  cursor: pointer;
  &:hover, &:active, &:visited {
    background: ${(props) =>
      props.color ? lighten(0.1, props.color) : lighten(0.1, Color.default)};
  }
  &:focus{
    outline: 0;
    box-shadow: 0 0 0 3px ${(props) =>
    props.color ? lighten(0.1, props.color) : lighten(0.1, Color.primary)};
  }
  span{
    margin-left: 5px;
  }
`;

export default ButtonWithStyles;
