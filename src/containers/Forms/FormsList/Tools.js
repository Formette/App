import React, { PureComponent } from "react";
//Components
import { InputGroup, Text, SubTitle, Content } from "../../../components/atoms";

class Tools extends PureComponent {
  render() {
    const { title, description, children, InputPlaceholder } = this.props;
    return (
      <Content>
        <SubTitle className="text-truncate">{title}</SubTitle>
        <Text className="text-truncate">{description}</Text>
        <div className="row">
          <div className="col">
            <InputGroup
              InputProps={{
                type: "text",
                className: "form-control",
                placeholder: InputPlaceholder
              }}
              IconProps={{ name: "fas fa-search" }}
            />
          </div>
          <div className="col">{children}</div>
        </div>
      </Content>
    );
  }
}

export default Tools;
