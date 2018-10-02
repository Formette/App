// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "react-apollo";
//Components
import AlertContainer from "react-alert";
import { Footer } from "../../components/organisms/index";
import Navbar from "./Navigation";
//Utilities
import { _getUsername } from "../../services/utilities";
//Styles
import styled, { withTheme } from "styled-components";
//Pages Navigation
import Router from "../../Router";

class App extends PureComponent {
  state = {
    username: _getUsername()
  };
  _updateUsername = () => {
    this.setState({ username: _getUsername() });
  };
  render() {
    return (
      <div className={this.props.className}>
        <Navbar
          brand="Formette β"
          username={this.state.username || "username"}
        />
        <div className="container-fluid content">
          <Router updateUsername={this._updateUsername} />
        </div>
        <Footer />
      </div>
    );
  }
}

const AppWithStyles = styled(App)`
  margin-top: 100px;
  .content {
    min-height: calc(88vh - 70px);
  }
`;

export default compose(
  withRouter,
  withTheme
)(AppWithStyles);
