//Styles
import styled from "styled-components";

const CardHeader = styled.div.attrs({
  className: "card-body"
})`
  background: ${props => props.theme.color.white};
`;

export default CardHeader;
