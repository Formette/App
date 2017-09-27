import React, { PureComponent } from "react";
//Components
import { Navbar, Footer } from "./organisms/index";
//Utilities
import { _getUsername } from "../services/utilities";
//Styles
import styled from "styled-components";
//Pages Navigation
import Router from "./Router";

class App extends PureComponent {
  state = {
    username: _getUsername()
  };
  _updateUsername = _ => {
    this.setState({ username: _getUsername() });
  };
  render() {
    return (
      <div className={this.props.className}>
        <Navbar
          brand="Formette β"
          username={this.state.username || "username"}
        />
        <div className="container content">
          <Router updateUsername={this._updateUsername} />
        </div>
        <Footer />
      </div>
    );
  }
}

const AppWithStyles = styled(App)`
  margin-top: 120px;
  .content {
    min-height: calc(88vh - 70px);
  }
`;

export default AppWithStyles;
