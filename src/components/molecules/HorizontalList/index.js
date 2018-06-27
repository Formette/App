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
  padding: 0;
  li {
    display: inline;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  @media (max-width: 375px) {
    li button span {
      display: none;
    }
  }
`;

export default HorizontalListWithStyles;
