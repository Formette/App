import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const SubTitle = styled.h5`
  color: ${props => props.color || props.theme.text.normal};
`;

SubTitle.defaultProps = {
  text: "Header Text",
  color: "#000000"
};

SubTitle.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string
};

export default SubTitle;
