import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
//Components
import Auth, { SignIn } from "vantage-auth";
//hocs
import { withUser } from "../../../hocs";
//API
import { SIGIN_USER_MUTATION } from "../../../api/Mutations";
import { userSignIn } from "../../../api/Functions";
//Utils
import LogRocket from "logrocket";
import { _isLoggedIn } from "../../../services/utilities";
//locales
import { injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
class LoginUser extends React.PureComponent {
  static propTypes = {
    confirmed: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    signinUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };
  componentDidMount() {
    if (_isLoggedIn()) {
      this.props.history.push("/");
    }
  }
  state = {
    error: false,
    errorMsg: "",
    isSubmiting: false
  };
  _onSignIn = async ({ email, password }) => {
    const { intl, user, history } = this.props;
    this.setState({ isSubmiting: true });
    //logs in the user
    const response = await userSignIn(email, password, this.props.signinUser);
    if (response.status) {
      LogRocket.track("Signed In");
      user.updateUser(response.rest);
      //sends to the dashboard
      history.push("/");
    } else {
      LogRocket.log("Ops! Invalid Email or password.");
      this.setState({
        isSubmiting: false,
        error: true,
        errorMsg: intl.formatMessage(messages.UserLoginInvalid)
      });
    }
  };
  _handleKeyEnter = event => {
    if (event.key === "Enter") {
      this._onSignIn();
    }
  };
  render() {
    const { error, errorMsg, isSubmiting } = this.state;
    const { intl } = this.props;
    const signInConfig = {
      title: intl.formatMessage(messages.UserLoginTitle),
      description: intl.formatMessage(messages.UserLoginDescription),
      submitText: intl.formatMessage(messages.UserLoginTitle),
      boxText: intl.formatMessage(messages.UserLoginBoxText),
      boxAction: intl.formatMessage(messages.UserLoginBoxAction),
      boxUrl: "#/signup",
      validationMgs: {
        email: {
          invalid: intl.formatMessage(messages.ErrorEmailPlaceholderInvalid),
          required: intl.formatMessage(messages.ErrorEmailPlaceholderRequired)
        },
        password: {
          min: intl.formatMessage(messages.ErrorPasswordPlaceholderMin),
          max: intl.formatMessage(messages.ErrorPasswordPlaceholderMax),
          required: intl.formatMessage(
            messages.ErrorPasswordPlaceholderRequired
          )
        }
      },
      placeholders: {
        email: intl.formatMessage(messages.UserCreateTextEmail),
        password: intl.formatMessage(messages.UserCreateTextPassword)
      }
    };
    return (
      <Fragment>
        <Auth>
          <SignIn
            handleSubmit={this._onSignIn}
            customError={error}
            customErrorMsg={errorMsg}
            isSubmiting={isSubmiting}
            {...signInConfig}
          />
        </Auth>
      </Fragment>
    );
  }
}

const loginUserWithData = compose(
  withUser,
  injectIntl,
  graphql(SIGIN_USER_MUTATION, { name: "signinUser" })
);

export default loginUserWithData(LoginUser);
