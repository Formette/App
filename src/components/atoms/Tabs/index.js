import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import { darken } from "polished";

const Tabs = ({ className, children }) => {
  return <main className={className}>{children}</main>;
};

Tabs.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
};

export default styled(Tabs)`
  .tab-input {
    display: none;
  }

  .tab-label {
    display: inline-block;
    margin: 0 0 -1px;
    padding: 15px 25px;
    font-weight: 600;
    text-align: center;
    color: ${props => props.theme.color.gray};
    border: 1px solid transparent;
  }

  .tab-label:before {
    font-family: fontawesome;
    font-weight: normal;
    margin-right: 10px;
  }

  .tab-label:hover {
    color: ${props => darken(0.1, props.theme.color.gray)};
    cursor: pointer;
  }

  .tab-input:checked + label {
    color: ${props => props.theme.color.primary};
    border-bottom: 1px solid ${props => props.theme.color.primary};
  }

  #tab1:checked ~ #content1,
  #tab2:checked ~ #content2,
  #tab3:checked ~ #content3,
  #tab4:checked ~ #content4 {
    display: block;
  }

  @media screen and (max-width: 576px) {
    .tab-label span {
      display: none;
    }
    .tab-label span:before {
      margin: 0;
      display: inline;
    }
  }
`;
