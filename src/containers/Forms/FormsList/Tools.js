import React from "react";
//Components
import { Text, SubTitle, Content, Icon } from "../../../components/atoms";

const Tools = ({
  title,
  description,
  titleTruncate,
  textTruncate,
  isDisabled,
  isDisabledText,
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
      {isDisabled && (
        <SubTitle>
          <span className="badge badge-secondary">
            <Icon className="fas fa-ban" /> {isDisabledText}
          </span>
        </SubTitle>
      )}
      <div className="row">{children}</div>
    </Content>
  );
};

export default Tools;
