import React from "react";
import PropTypes from "prop-types";
//Components
import { Text, SubTitle, Content, Icon } from "../../../components/atoms";

const DetailsActions = ({
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
      <div className="row">
        <div className="col-md-6 col-sm-12">
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
        </div>
        <div className="col-md-6 col-sm-12">{children}</div>
      </div>
    </Content>
  );
};

DetailsActions.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  titleTruncate: PropTypes.bool,
  textTruncate: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isDisabledText: PropTypes.string,
  children: PropTypes.any.isRequired
};

export default DetailsActions;
