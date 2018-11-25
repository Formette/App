import React from "react";
import PropTypes from "prop-types";
//Components
import { Text, SubTitle } from "../../atoms/index";
//Styles
import styled from "styled-components";

const Graphic = ({ title, description, imgType, className, children }) => {
  return (
    <div className={`${className} text-center animated fadeIn`}>
      <img src={`imgs/${imgType}.svg`} alt={imgType} />
      <SubTitle>{title}</SubTitle>
      <Text>{description}</Text>
      {children}
    </div>
  );
};

Graphic.defaultProps = {
  icon: "fa-map-signs",
  title: "Text",
  description: "Text",
  imgType: "data"
};

Graphic.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgType: PropTypes.string.isRequired,
  top: PropTypes.number,
  children: PropTypes.any,
  className: PropTypes.string
};

export default styled(Graphic)`
  margin: 0 auto;
  margin-top: ${props => props.top || 0}px;
  img {
    width: 300px;
  }
  h5,
  p {
    margin-top: 10px;
    padding: 0 100px 0 100px;
  }
  @media (min-width: 992px) {
    width: 50%;
  }
`;
