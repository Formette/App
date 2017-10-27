import React from "react";
//Styles
import styled from "styled-components";
import Colors from "../../styles/Colors";

const Title = ({ text, className }) => <h3 className={className}>{text}</h3>;

Title.defaultProps = {
  text: "Text"
};

const TitleWithStyles = styled(Title)`
  color: ${(props) => (props.color ? props.color : Colors.text.normal)};
`;

export default TitleWithStyles;
