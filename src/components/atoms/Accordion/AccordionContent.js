import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const AccordionContent = ({ className, children }) => {
  return <div className={`${className} tab-content`}>{children}</div>;
};

AccordionContent.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
};

export default styled(AccordionContent)`
  max-height: 0;
  overflow: hidden;
  background: ${props => props.theme.color.background};
  -webkit-transition: max-height 0.35s;
  -o-transition: max-height 0.35s;
  transition: max-height 0.35s;

  p {
    margin: 15px 10px;
  }
`;
