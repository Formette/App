import React, { PureComponent } from "react";
//Components
import { Text, SubTitle, Content } from "../../../components/atoms";

class Tools extends PureComponent {
  render() {
    const { title, description, children } = this.props;
    return (
      <Content>
        <SubTitle className="text-truncate">{title}</SubTitle>
        <Text className="text-truncate">{description}</Text>
        <div className="row">{children}</div>
      </Content>
    );
  }
}

export default Tools;
