import React from "react";
//Components
import { Button } from "../../atoms/index";
import { Graphic } from "../../molecules/index";

const NoMatch = props => {
  return (
    <Graphic
      title="Page not found"
      description="Omg 😣 No form found to fill! The page you are trying to find is not available."
      imgType="lost"
    >
      <Button
        className="btn btn-lg"
        color={"black"}
        onClick={() => props.history.push("/")}
        primary
      >
        Go back home
      </Button>
    </Graphic>
  );
};

export default NoMatch;
