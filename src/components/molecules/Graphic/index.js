import React from "react";
import PropTypes from "prop-types";
//Components
import { Text, Icon } from "../../atoms/index";
//Styles
import styled from "styled-components";

const Graphic = props => {
  return (
    <div className={`${props.className} text-center `}>
      <Icon name={props.icon} />
      <Text text={props.text} />
      {props.children}
    </div>
  );
};

Graphic.defaultProps = {
  icon: "fa-map-signs",
  text: "Text"
};

Graphic.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string
};

const GraphicWithStyles = styled(Graphic)`
  i {
    font-size: ${props => props.size || props.theme.h1};
    color: ${props => props.iconColor || props.theme.text.secondary};
  }
  p {
    margin-top: 20px;
    padding: 0 100px 0 100px;
    color: ${props => props.textColor || props.theme.text.secondary};
    font-size: 20px;
  }
`;

export default GraphicWithStyles;
