//Styles
import styled from "styled-components";

const Card = styled.div.attrs({
  className: "card"
})`
  background: ${props => props.theme.color.white};
  border-radius: ${props => props.theme.radius};
  border: 1px solid ${props => props.theme.color.border};
  box-shadow: ${props => props.theme.boxShadow};
`;

export default Card;
