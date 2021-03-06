import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Placeholder = props => {
  return (
    <div className={`card ${props.className}`}>
      <div className="card-body">{props.children}</div>
    </div>
  );
};

Placeholder.defaultProps = {
  width: 13,
  height: 12
};

Placeholder.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default styled(Placeholder)`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: #f0f0f0;
  float: left;
  margin: 0 10px 11px 0;
  &:last-child {
    margin: 0;
  }
  @media (max-width: 465px) {
    width: 8rem;
    height: 157px;
  }
`;
