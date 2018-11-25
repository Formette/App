import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
//Components
import AuthLayout from "../../../components/organisms/AuthLayout";
import { Input, Button, Link } from "../../../components/atoms";
import Error from "../../../components/molecules/Error";
import { Footer } from "../../../components/organisms";
//hocs
import { withUser } from "../../../hocs";
//API
import { SIGIN_USER_MUTATION } from "../../../api/Mutations";
import { userSignIn } from "../../../api/Functions";
//Utils
import LogRocket from "logrocket";
import { _isLoggedIn } from "../../../services/utilities";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
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
    email: "",
    password: "",
    error: false,
    errorMsg: ""
  };
  _onSignIn = async () => {
    const { email, password } = this.state;
    const { intl, user, history } = this.props;
    //Verifies if the inputs are empty or not
    if (email && password) {
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
          error: true,
          errorMsg: intl.formatMessage(messages.UserLoginInvalid)
        });
      }
    } else {
      LogRocket.info(
        "This form is feeling lonely, needs affection, needs data."
      );
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.UserCreateFormEmpty)
      });
    }
  };
  _handleKeyEnter = event => {
    if (event.key === "Enter") {
      this._onSignIn();
    }
  };
  render() {
    const { email, password, error, errorMsg } = this.state;
    const { history, intl } = this.props;
    return (
      <Fragment>
        <AuthLayout
          description={intl.formatMessage(messages.UserLoginDescription)}
        >
          <label htmlFor="signinEmail" className="sr-only">
            <FormattedMessage
              id="user.account.create.text.email"
              defaultMessage={"Email address"}
            />
          </label>
          <Input
            id="signinEmail"
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

          <label htmlFor="signinPassword" className="sr-only">
            <FormattedMessage
              id="user.account.create.text.password"
              defaultMessage={"Password"}
            />
          </label>
          <Input
            id="signinPassword"
            type="password"
            value={password}
            onChange={e =>
              this.setState({ password: e.target.value, error: false })
            }
            onKeyPress={this._handleKeyEnter}
            className={`form-control ${error && "is-invalid"}`}
            placeholder={intl.formatMessage(messages.UserCreateTextPassword)}
            required
            autoFocus
          />

          <Button
            className="btn btn-lg btn-block"
            onClick={this._onSignIn}
            style={{ marginTop: 10, marginBottom: 10 }}
            primary
          >
            <FormattedMessage
              id="user.account.create.action.signin"
              defaultMessage={"Sign In"}
            />
          </Button>

          <Link onClick={() => history.push("/signup")}>
            <FormattedMessage
              id="user.account.login.placeholder.create"
              defaultMessage={"Do not have an account yet? Omg is free."}
            />{" "}
            <u>
              <strong>
                <FormattedMessage
                  id="user.account.login.action.create"
                  defaultMessage={"Create here!"}
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

const loginUserWithData = compose(
  withUser,
  injectIntl,
  graphql(SIGIN_USER_MUTATION, { name: "signinUser" })
);

export default loginUserWithData(LoginUser);
