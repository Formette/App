import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const CardBody = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.default};
  border-top: 1px solid ${props => props.theme.color.border};
  border-bottom: 1px solid ${props => props.theme.color.border};
`;

CardBody.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.object
};

export default CardBody;
