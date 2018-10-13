import React from "react";
//Components
import { Text, SubTitle, Content } from "../../../components/atoms";

const Tools = ({
  title,
  description,
  titleTruncate,
  textTruncate,
  children
}) => {
  return (
    <Content>
      <SubTitle className={`${titleTruncate && "text-truncate"}`}>
        {title}
      </SubTitle>
      <Text className={`${textTruncate && "text-truncate"}`}>
        {description}
      </Text>
      <div className="row">{children}</div>
    </Content>
  );
};

export default Tools;
