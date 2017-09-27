import React from "react";
//Components
import { Button } from "../components/atoms/index";
import { Graphic } from "../components/molecules/index";
//Styles
import Colors from "../styles/Colors";

const NoMatch = props => {
  return (
    <Graphic
      text="Omg 😣 No form found to fill! The page you are trying to find is not available."
      icon="fa-exclamation-triangle"
    >
      <Button
        className="btn btn-lg btn-primary"
        color={Colors.primary}
        onClick={_ => props.history.push("/")}
      >
        Go back home
      </Button>
    </Graphic>
  );
};

export default NoMatch;
