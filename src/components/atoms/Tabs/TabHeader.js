import React, { Fragment } from "react";
import PropTypes from "prop-types";
//Components
import Icon from "../Icon";

const TabHeader = ({ id, group, iconName, children, ...props }) => {
  return (
    <Fragment>
      <input
        id={id}
        type="radio"
        name={group}
        {...props}
        className="tab-input"
      />
      <label className="tab-label" htmlFor={id}>
        {" "}
        <Icon name={iconName} /> <span>{children}</span>
      </label>
    </Fragment>
  );
};

TabHeader.defaultProps = {
  id: "tab1",
  group: "tabs",
  iconName: "fas fa-download"
};

TabHeader.propTypes = {
  id: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  iconName: PropTypes.string
};

export default TabHeader;
