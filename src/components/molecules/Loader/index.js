import React from "react";
import PropTypes from "prop-types";
//components
import { SpinLoader } from "react-loaders-spinners";
//styles
import styled from "styled-components";
import theme from "../../../styles/Theme";

const Loader = props => {
  return (
    <div className={`${props.className}`}>
      <SpinLoader pColor={theme.color.primary} sColor={theme.color.default} />
    </div>
  );
};

Loader.defaultProps = {
  width: 13,
  height: 12
};

Loader.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default styled(Loader)`
  margin: 0 auto;
  margin-top: 100px;
`;
