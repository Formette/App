// CreateUser.test.js
import React from "react";
import { CreateUser } from "../containers/CreateUser";
import renderer from "react-test-renderer";

describe("Create User", () => {
  it("UI renders correctly", () => {
    const tree = renderer.create(<CreateUser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
