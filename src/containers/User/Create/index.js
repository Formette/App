import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { graphql, compose, withApollo } from "react-apollo";
//Components
import Auth, { SignUp } from "vantage-auth";
//hocs
import { withUser } from "../../../hocs";
//API
import { USERNAME_VALIDATION_QUERY } from "../../../api/Queries";
import {
  SIGIN_USER_MUTATION,
  CREATE_USER_MUTATION
} from "../../../api/Mutations";
import { userSignIn } from "../../../api/Functions";
//Utils
import { _isLoggedIn } from "../../../services/utilities";
import {
  generateToken,
  generateExpiration,
  emailBlackList,
  formatUsername
} from "@vacom/vantage";

import LogRocket from "logrocket";
//locales
import { injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
export class CreateUser extends React.PureComponent {
  static propTypes = {
    createUser: PropTypes.func.isRequired,
    signinUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  state = {
    error: false,
    errorMsg: "",
    isSubmiting: false
  };
  componentDidMount() {
    if (_isLoggedIn()) {
      this.props.history.push("/");
    }
  }
  _onCreateUser = data => {
    const { intl } = this.props;
    const { email, password, approvePrivacy: approvedPrivacy } = data;
    let username = formatUsername(data.username);
    if (emailBlackList(email)) {
      this.setState({
        isSubmiting: false,
        error: true,
        errorMsg: intl.formatMessage(messages.UserCreateEmailNotSupported)
      });
      return;
    }
    this.setState({ isSubmiting: true });
    //Creates a new user
    this.props
      .createUser({
        variables: {
          email,
          password,
          username,
          confirmToken: generateToken(),
          confirmExpires: generateExpiration(),
          approvedPrivacy
        }
      })
      .then(() => {
        LogRocket.track("Registered");
        this._onSignIn(email, password);
      })
      .catch(e => {
        LogRocket.error({ CreateUser: e });
        this.setState({
          isSubmiting: false,
          error: true,
          errorMsg: intl.formatMessage(messages.UserCreateEmailExists)
        });
      });
  };
  _onSignIn = async (email, password) => {
    //logs in the user
    const { intl, user, history } = this.props;
    const response = await userSignIn(email, password, this.props.signinUser);
    if (response.status) {
      LogRocket.track("Sign in");
      user.updateUser(response.rest);
      //sends to the dashboard
      history.push("/");
    } else {
      LogRocket.error({ SignIn: response });
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.GraphicErrorDescription)
      });
    }
  };

  _onUsernameValidation(getUsername) {
    clearTimeout(this.state.timeoutUserName);
    const { intl } = this.props;
    this.setState({
      timeoutUserName: setTimeout(() => {
        let username = formatUsername(getUsername);
        this.props.client
          .query({
            query: USERNAME_VALIDATION_QUERY,
            variables: { username }
          })
          .then(res => {
            if (Object.keys(res.data.allUsers).length !== 0) {
              LogRocket.info(
                "With so much name in this world, you had to choose this one. Try another."
              );
              this.setState({
                error: true,
                errorMsg: intl.formatMessage(
                  messages.UserCreateFormUsernameError
                )
              });
            } else {
              this.setState({ error: false });
            }
          })
          .catch(e => {
            LogRocket.error({ _onUsernameValidation: e });
          });
      }, 500)
    });
  }

  render() {
    const { error, errorMsg, isSubmiting } = this.state;
    const { intl } = this.props;
    const signUpConfig = {
      title: intl.formatMessage(messages.UserCreateTitle), // "Sign Up",
      description: intl.formatMessage(messages.UserCreateDescription), // "New life for static forms, no need for code or servers.",
      submitText: intl.formatMessage(messages.UserCreateAccount), //"Sign up",
      boxText: intl.formatMessage(messages.UserCreateBoxText), //"Already have an account?",
      boxAction: intl.formatMessage(messages.UserCreateBoxAction), // "Sign In",
      boxUrl: "#/signin",
      privacyUrl: "http://bit.ly/formetteprivacy",
      validationMgs: {
        username: {
          lowercase: intl.formatMessage(
            messages.ErrorUsernamePlaceholderLowercase
          ),
          min: intl.formatMessage(messages.ErrorUsernamePlaceholderMin),
          max: intl.formatMessage(messages.ErrorUsernamePlaceholderMax),
          required: intl.formatMessage(
            messages.ErrorUsernamePlaceholderRequired
          )
        },
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
        },
        approvePrivacy: {
          required: intl.formatMessage(messages.ErrorApprovePrivacyRequired)
        }
      }
    };
    return (
      <Fragment>
        <Auth>
          <SignUp
            handleSubmit={this._onCreateUser}
            customError={error}
            customErrorMsg={errorMsg}
            isSubmiting={isSubmiting}
            {...signUpConfig}
          />
        </Auth>
      </Fragment>
    );
  }
}

const createUserWithData = compose(
  withUser,
  injectIntl,
  graphql(CREATE_USER_MUTATION, { name: "createUser" }),
  graphql(SIGIN_USER_MUTATION, { name: "signinUser" })
);

export default withApollo(createUserWithData(CreateUser));
