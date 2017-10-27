import React from "react";
import PropTypes from "prop-types";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";

const Input = (props) => (
  <input
    type={props.type}
    className={`${props.className}`}
    placeholder={props.placeholder}
    {...props}
  />
);

Input.defaultProps = {
  type: "text",
  placeholder: "Some text"
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
};

const InputWithStyles = styled(Input)`
  border-radius: 0;
  border-color: ${Colors.border};
  margin: 10px 0 10px 0;
  padding: 0.7rem 0.75rem;
`;

export default InputWithStyles;
