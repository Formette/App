import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Card = styled.div.attrs({
  className: "card"
})`
  background: ${props => props.theme.color.white};
  border-radius: ${props => props.theme.radius};
  border: 1px solid ${props => props.theme.color.border};
  box-shadow: ${props => props.theme.boxShadow};
  width: ${props => (props.width ? props.width : "auto")};
  height: ${props => (props.height ? props.height : "auto")};
  cursor: ${props => (props.pointer ? "pointer" : "inhered")};
`;

Card.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  pointer: PropTypes.string,
  theme: PropTypes.object
};

export default Card;
