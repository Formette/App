import React from "react";
//Components
import { Button } from "../../atoms/index";
import { Graphic } from "../../molecules/index";

const NoMatch = props => {
  return (
    <Graphic
      text="Omg 😣 No form found to fill! The page you are trying to find is not available."
      icon="fa-exclamation-triangle"
    >
      <Button
        className="btn btn-lg btn-primary"
        color={"black"}
        onClick={() => props.history.push("/")}
      >
        Go back home
      </Button>
    </Graphic>
  );
};

export default NoMatch;
