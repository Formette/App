import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { graphql, compose, withApollo } from "react-apollo";
//Components
import AuthLayout from "../../../components/organisms/AuthLayout";
import { Input, Button, Link } from "../../../components/atoms";
import Error from "../../../components/molecules/Error";
import { Footer } from "../../../components/organisms";
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
import {
  generateToken,
  generateExpiration,
  _formatUsername,
  _validateEmail,
  _emailBlackList,
  _isLoggedIn
} from "../../../services/utilities";
import LogRocket from "logrocket";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
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
    email: "",
    password: "",
    username: "",
    approvedPrivacy: false,
    error: false,
    errorMsg: "",
    timeoutUserName: 0,
    timeoutPassword: 0
  };
  componentDidMount() {
    if (_isLoggedIn()) {
      this.props.history.push("/");
    }
  }
  _onCreateUser = () => {
    const { intl } = this.props;
    const { email, password, approvedPrivacy, error } = this.state;
    let username = _formatUsername(this.state.username);
    //Verifies if the inputs are empty or not
    if (email && password && username) {
      if (error) {
        return;
      }
      //Verifies if the user accepted the policy
      if (!approvedPrivacy) {
        this.setState({
          error: true,
          errorMsg: intl.formatMessage(
            messages.UserCreatePolicyVerificationInvalid
          )
        });
        return;
      }

      if (!_validateEmail(email)) {
        this.setState({
          error: true,
          errorMsg: intl.formatMessage(
            messages.UserCreateEmailVerificationInvalid
          )
        });
        return;
      }

      if (_emailBlackList(email)) {
        this.setState({
          error: true,
          errorMsg: intl.formatMessage(messages.UserCreateEmailNotSupported)
        });
        return;
      }

      if (this._checkPassword(password)) return;
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
            error: true,
            errorMsg: intl.formatMessage(messages.UserCreateEmailExists)
          });
        });
    } else {
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.UserCreateFormEmpty)
      });
    }
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
  _onPasswordValidation(password) {
    clearTimeout(this.state.timeoutPassword);
    this.setState({
      timeoutPassword: setTimeout(() => {
        this._checkPassword(password);
      }, 500)
    });
  }
  _checkPassword(password) {
    const { intl } = this.props;
    if (password.length <= 8) {
      LogRocket.warn(
        "With so much room in the box, you chose this tiny thing. We need more than 8 characters, go we know you can."
      );
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.UserCreateFormPasswordError)
      });
      return true;
    }
    this.setState({ error: false });
  }
  _onUsernameValidation(getUsername) {
    clearTimeout(this.state.timeoutUserName);
    const { intl } = this.props;
    this.setState({
      timeoutUserName: setTimeout(() => {
        let username = _formatUsername(getUsername);
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
  _handleKeyEnter = event => {
    if (event.key === "Enter") {
      this._onCreateUser();
    }
  };
  render() {
    const {
      email,
      password,
      username,
      approvedPrivacy,
      error,
      errorMsg
    } = this.state;
    const { history, intl } = this.props;
    return (
      <Fragment>
        <AuthLayout
          description={intl.formatMessage(messages.UserCreateDescription)}
        >
          <label htmlFor="signupUsername" className="sr-only">
            <FormattedMessage
              id="user.account.create.text.username"
              defaultMessage={"Username"}
            />
          </label>
          <Input
            id="signupUsername"
            value={username}
            onChange={e =>
              this.setState({ username: e.target.value, error: false })
            }
            onKeyPress={this._handleKeyEnter}
            onKeyUp={e => this._onUsernameValidation(e.target.value)}
            className={`form-control ${error && "is-invalid"}`}
            placeholder={intl.formatMessage(messages.UserCreateTextUsername)}
            required
            autoFocus
          />
          <label htmlFor="signupEmail" className="sr-only">
            <FormattedMessage
              id="user.account.create.text.email"
              defaultMessage={"Email address"}
            />
          </label>
          <Input
            id="signupEmail"
            type="email"
            value={email}
            onChange={e =>
              this.setState({ email: e.target.value, error: false })
            }
            onKeyPress={this._handleKeyEnter}
            className={`form-control ${error && "is-invalid"}`}
            placeholder={intl.formatMessage(messages.UserCreateTextEmail)}
            required
            autoFocus
          />

          <label htmlFor="signupPassword" className="sr-only">
            <FormattedMessage
              id="user.account.create.text.password"
              defaultMessage={"Password"}
            />
          </label>
          <Input
            id="signupPassword"
            type="password"
            value={password}
            onChange={e =>
              this.setState({ password: e.target.value, error: false })
            }
            onKeyPress={this._handleKeyEnter}
            onKeyUp={e => this._onPasswordValidation(e.target.value)}
            className={`form-control ${error && "is-invalid"}`}
            placeholder={intl.formatMessage(messages.UserCreateTextPassword)}
            required
            autoFocus
          />

          <span>
            <label htmlFor="signupApprovedPrivacy" className="sr-only">
              <FormattedMessage
                id="user.account.create.text.approvedPrivacy"
                defaultMessage={"Accept the Terms and Privacy Policy"}
              />
            </label>
            <input
              id="signupApprovedPrivacy"
              type="checkbox"
              value={approvedPrivacy}
              onChange={e =>
                this.setState({
                  approvedPrivacy: e.target.checked,
                  error: false
                })
              }
              onKeyPress={this._handleKeyEnter}
              className={`${error && "is-invalid"}`}
              required
              autoFocus
            />
            <Link
              href="https://www.iubenda.com/privacy-policy/54274847/legal?ifr=true&height=690"
              target="_blank"
            >
              {"  "}
              <FormattedMessage
                id="user.account.create.text.approvedPrivacy"
                defaultMessage={"Accept the Terms and Privacy Policy"}
              />
            </Link>
          </span>

          <Button
            className="btn btn-lg btn-block"
            onClick={this._onCreateUser}
            style={{ marginTop: 10, marginBottom: 10 }}
            primary
          >
            <FormattedMessage
              id="user.account.create.action.create"
              defaultMessage={"Create Account"}
            />
          </Button>

          <Link onClick={() => history.push("/signin")}>
            <FormattedMessage
              id="user.account.create.text.has.account"
              defaultMessage={"Already have an account? Your forms miss you."}
            />{" "}
            <u>
              <strong>
                <FormattedMessage
                  id="user.account.create.action.signin"
                  defaultMessage={"Sign In"}
                />
              </strong>
            </u>
          </Link>
          <Error show={error}>{errorMsg}</Error>
        </AuthLayout>
        <Footer />
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
