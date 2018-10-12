import React from "react";
//Components
import Icon from "../Icon";
//Styles
import styled from "styled-components";

const InputGroup = ({
  className,
  InputProps,
  IconProps,
  onChange,
  onKeyUp
}) => {
  return (
    <div className={`${className} input-group input-group-lg`}>
      <div className="input-group-prepend">
        <span className="input-group-text">
          <Icon {...IconProps} />
        </span>
      </div>
      <input onChange={onChange} onKeyUp={onKeyUp} {...InputProps} />
    </div>
  );
};

InputGroup.defaultProps = {
  IconProps: { name: "fas fa-plus" },
  InputProps: {
    type: "text",
    className: "form-control",
    placeholder: "Some Text"
  }
};

export default styled(InputGroup)`
  box-shadow: ${props => props.theme.boxShadow};
  border: 1px solid ${props => props.theme.color.border};
  .input-group-text {
    background-color: ${props =>
      props.InputProps.readOnly ? "#E9ECEF" : props.theme.color.white};
    border: none;
    i {
      color: ${props => props.theme.text.secondary};
    }
  }
  input {
    border: none;
  }
`;
