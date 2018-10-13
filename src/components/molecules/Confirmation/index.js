import React from "react";
import PropTypes from "prop-types";
//Components
import { Title, Text, Button, Link } from "../../atoms/index";
//Styles
import styled from "styled-components";

const Confirmation = ({ className, show, title, description, actionProps, ...props }) => {
  return (
    <div
      className={`card mx-auto animated zoomInUp ${className}`}
      style={{ display: show ? "inline" : "none" }}
    >
      <div className="card-body">
        <Title>{title}</Title>
        <Text>{description}</Text>
        <div className="text-right">
          <Link className="cancelAction" onClick={() => props.onCancel()}>
            Cancel
          </Link>
          <Button
            className="btn"
            onClick={() => props.onConfirmation()}
            color={props.onConfirmationColor}
            {...actionProps}
          >
            {props.onConfirmationText}
          </Button>
        </div>
      </div>
    </div>
  );
};

Confirmation.defaultProps = {
  title: "Form Title",
  description: "Form Date",
  onConfirmationText: "Delete",
  onConfirmationColor: "red",
  show: false
};

Confirmation.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onConfirmationText: PropTypes.string,
  onConfirmationColor: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onConfirmation: PropTypes.func,
  onCancel: PropTypes.func
};

export default styled(Confirmation)`
  width: 20rem;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 9999;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  .cancelAction {
    margin-right: 10px;
  }
`;
