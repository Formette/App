import React from "react";
import PropTypes from "prop-types";
//Components
import { Text, Icon, SubTitle } from "../../atoms/index";
//Styles
import styled from "styled-components";

const Graphic = ({ title, description, imgType, className, children }) => {
  return (
    <div className={`col ${className} text-center `}>
      <img src={`imgs/${imgType}.svg`} alt={imgType} />
      <SubTitle>{title}</SubTitle>
      <Text>{description}</Text>
      {children}
    </div>
  );
};

Graphic.defaultProps = {
  icon: "fa-map-signs",
  text: "Text",
  imgType: "data"
};

Graphic.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.any,
  className: PropTypes.string
};

export default styled(Graphic)`
  margin: 0 auto;
  margin-top: 80px;
  img {
    width: 300px;
  }
  h5,
  p {
    margin-top: 10px;
    padding: 0 100px 0 100px;
  }
  p {
    padding: 0 350px;
  }
`;
