import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
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
//locales
import { FormattedMessage } from "react-intl";

class App extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };
  render() {
    return (
      <div className={this.props.className}>
        <UserContext.Consumer>
          {context => (
            <Fragment>
              <Navbar brand="Formette β" username={context.state.userName} />
              {!context.state.accountConfirmed && (
                <Alert className="alert-warning" role="alert">
                  <FormattedMessage
                    id="user.account.activate.warning"
                    defaultMessage={" You have not activated your account yet."}
                  />{" "}
                  <a href="#/confirm" className="alert-link">
                    <FormattedMessage
                      id="user.account.activate.warning.action"
                      defaultMessage={"Click here to activate."}
                    />
                  </a>
                </Alert>
              )}
            </Fragment>
          )}
        </UserContext.Consumer>
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
