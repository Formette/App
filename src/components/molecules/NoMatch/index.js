import React from "react";
import PropTypes from "prop-types";
//Components
import { Button } from "../../atoms/index";
import { Graphic } from "../../molecules/index";
import { injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

const NoMatch = props => {
  return (
    <Graphic
      title={props.intl.formatMessage(messages.PageNoMatchTitle)}
      description={props.intl.formatMessage(messages.PageNoMatchDescription)}
      imgType="lost"
      top={200}
    >
      <Button
        className="btn btn-lg"
        color={"black"}
        onClick={() => props.history.push("/")}
        primary
      >
        {props.intl.formatMessage(messages.PageNoMatchActionText)}
      </Button>
    </Graphic>
  );
};

NoMatch.propTypes = {
  intl: PropTypes.object,
  history: PropTypes.object
};

export default injectIntl(NoMatch);
