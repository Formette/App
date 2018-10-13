//Styles
import styled from "styled-components";

const CardFooter = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.white};
`;

export default CardFooter;
