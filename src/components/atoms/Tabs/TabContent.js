import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const TabContent = ({ id, className, children }) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

TabContent.defaultProps = {
  id: "content 1",
  bg: "#000000"
};

TabContent.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

export default styled(TabContent)`
  display: none;
  padding: 20px 0 0;
  border-top: 1px solid ${props => props.theme.color.gray};
`;
