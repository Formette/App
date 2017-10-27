import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";
import { lighten } from "polished";

const Link = (props) => (
  <a className={props.className} {...props}>
    {props.children}
  </a>
);

Link.defaultProps = {
  children: "Text"
};

Link.propTypes = {
  children: PropTypes.any.isRequired
};

const LinkWithStyles = styled(Link)`
  color: ${(props) =>
    props.color ? props.color : Colors.link.normal} !important;
  text-decoration: none !important;
  &:hover {
    color: ${(props) =>
      props.color
        ? lighten(0.1, props.color)
        : Colors.link.highlight} !important;
    cursor: pointer;
  }
`;

export default LinkWithStyles;
