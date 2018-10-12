import React from "react";
//Components
import { Button } from "../../atoms/index";
import { Graphic } from "../../molecules/index";

const NoMatch = props => {
  return (
    <Graphic
      title="Page not found"
      description="The page you are trying to find is not available."
      imgType="lost"
      top={200}
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
