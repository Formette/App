import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const CardHeader = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.white};
`;

CardHeader.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.object
};

export default CardHeader;
