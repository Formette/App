// Button.test.js
import React from "react";
import Button from "./index";
import renderer from "react-test-renderer";

test("Button renders correctly", () => {
  const component = renderer.create(
    <Button type="button" color="#000">
      Hello
    </Button>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
