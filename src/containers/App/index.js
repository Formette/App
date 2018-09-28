// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "react-apollo";
//Components
import AlertContainer from "react-alert";
import { Icon } from "../../components/atoms/index";
import { Footer } from "../../components/organisms/index";
import Navbar from "./Navigation";
//Utilities
import { _getUsername } from "../../services/utilities";
import { ALERT_OPTIONS } from "../../services/Constants";
//Styles
import styled, { withTheme } from "styled-components";
//Pages Navigation
import Router from "../../Router";

class App extends PureComponent {
  msg: () => mixed;
  state = {
    username: _getUsername()
  };
  _updateUsername = () => {
    this.setState({ username: _getUsername() });
  };
  showAlert(
    type: string = "success",
    text: string = "Some Text",
    color: string = this.props.theme.color.green,
    icon: string = "fa-link"
  ) {
    this.msg.show(text, {
      time: 3000,
      type,
      icon: <Icon name={icon} color={color} />
    });
  }
  render() {
    return (
      <div className={this.props.className}>
        <AlertContainer ref={a => (this.msg = a)} {...ALERT_OPTIONS} />
        <Navbar
          brand="Formette β"
          username={this.state.username || "username"}
        />
        <div className="container content">
          <Router
            updateUsername={this._updateUsername}
            showMessage={(type, text, ...rest) =>
              this.showAlert(type, text, ...rest)
            }
          />
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

export default compose(
  withRouter,
  withTheme
)(AppWithStyles);
