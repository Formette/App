//Styles
import styled from "styled-components";

const CardBody = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.default};
  border-top: 1px solid ${props => props.theme.color.border};
  border-bottom: 1px solid ${props => props.theme.color.border};
`;

export default CardBody;
