import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import { lighten } from "polished";

const Link = styled.a`
  color: ${props =>
    props.color ? props.color : props.theme.link.normal} !important;
  text-decoration: none !important;
  &:hover {
    color: ${props =>
      props.color
        ? lighten(0.1, props.color)
        : props.theme.link.highlight} !important;
    cursor: pointer;
  }
`;

Link.defaultProps = {
  children: "Text"
};

Link.propTypes = {
  children: PropTypes.any.isRequired
};

export default Link;
