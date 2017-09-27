// Profile.test.js
//Utils
import "./helpers/browser";
import "./helpers/mock-localstorage";
import React from "react";
import { Profile } from "../containers/Profile";
import renderer from "react-test-renderer";

describe("Profile", () => {
  it("UI renders correctly", () => {
    const data = {
      user: {
        email: "amaralvitor@ua.pt",
        id: "cj5frzfv11z6y0180k67lraep",
        userName: "vacom",
        _formsesMeta: {
          count: 3
        }
      }
    };

    const tree = renderer.create(<Profile userQuery={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
