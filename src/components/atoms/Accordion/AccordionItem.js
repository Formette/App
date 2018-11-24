import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const AccordionItem = ({ className, children, id, title }) => {
  return (
    <div className={`${className}`}>
      <input className="tab-input" id={id} type="checkbox" name="tabs" />
      <label htmlFor={id}>{title}</label>
      {children}
    </div>
  );
};

AccordionItem.propTypes = {
  children: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default styled(AccordionItem)`
  position: relative;
  margin-bottom: 1px;
  width: 100%;
  color: ${props => props.theme.text.secondary};
  overflow: hidden;

  .tab-input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  label {
    margin: 0;
    position: relative;
    display: block;
    padding: 0 0 0 1em;
    background: ${props => props.theme.color.default};
    border-radius: ${props => props.theme.radius};
    border: 1px solid ${props => props.theme.color.border};
    box-shadow: ${props => props.theme.boxShadow};
    font-weight: bold;
    line-height: 3;
    cursor: pointer;
  }

  /* :checked */
  .tab-input:checked ~ .tab-content {
    max-height: 100vh;
  }
  /* Icon */
  label::after {
    position: absolute;
    right: 0;
    top: 0;
    display: block;
    width: 3em;
    height: 3em;
    line-height: 3;
    text-align: center;
    -webkit-transition: all 0.35s;
    -o-transition: all 0.35s;
    transition: all 0.35s;
  }
  .tab-input[type="checkbox"] + label::after {
    content: "+";
  }
  .tab-input[type="radio"] + label::after {
    content: "\\25BC";
  }
  .tab-input[type="checkbox"]:checked + label::after {
    transform: rotate(315deg);
  }
  .tab-input[type="radio"]:checked + label::after {
    transform: rotateX(180deg);
  }
`;
