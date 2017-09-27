import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const HorizontalList = props => (
  <ul className={props.className}>{props.children}</ul>
);

HorizontalList.defaultProps = {
  children: "Text"
};

HorizontalList.propTypes = {
  children: PropTypes.any.isRequired
};

const HorizontalListWithStyles = styled(HorizontalList)`
  li {
    display: inline;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export default HorizontalListWithStyles;
