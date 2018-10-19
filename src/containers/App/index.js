// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "react-apollo";
//Components
import { Alert } from "../../components/atoms";
import { Footer } from "../../components/organisms";
import Navbar from "./Navigation";
import MobileNavbar from "./MobileNavigation";
//Context
import { UserContext } from "../../context/UserContext";
//hocs
import { withUser } from "../../hocs";
//Styles
import styled, { withTheme } from "styled-components";
//Pages Navigation
import Router from "../../Router";

class App extends PureComponent {
  state = {
    accountConfirmed: true
  };
  componentWillReceiveProps(nextProps) {
    const { confirmed } = nextProps.user.state.profile;
    this.setState({ accountConfirmed: confirmed });
  }
  render() {
    return (
      <div className={this.props.className}>
        <UserContext.Consumer>
          {context => (
            <Navbar brand="Formette β" username={context.state.userName} />
          )}
        </UserContext.Consumer>
        {!this.state.accountConfirmed && (
          <Alert className="alert-warning" role="alert">
            You have not activated your account yet.{" "}
            <a href="#/confirm" className="alert-link">
              Click here to activate.
            </a>
          </Alert>
        )}
        <div className="container-fluid content">
          <Router />
        </div>
        <Footer />
        <MobileNavbar />
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
  withUser,
  withRouter,
  withTheme
)(AppWithStyles);
