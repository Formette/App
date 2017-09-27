// LoginUser.test.js
import React from "react";
import LoginUser from "../containers/LoginUser";
import renderer from "react-test-renderer";

describe("Login", () => {
  it("UI renders correctly", () => {
    const tree = renderer.create(<LoginUser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
