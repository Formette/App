//Styles
import styled from "styled-components";

const Title = styled.h3`
  color: ${props => (props.color ? props.color : props.theme.text.normal)};
`;

Title.defaultProps = {
  text: "Text"
};

export default Title;
