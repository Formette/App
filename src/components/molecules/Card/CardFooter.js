import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const CardFooter = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.white};
`;

CardFooter.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.object
};

export default CardFooter;
