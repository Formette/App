// @flow
import React from "react";
import { graphql, compose } from "react-apollo";
//Components
import AuthLayout from "../../../components/organisms/AuthLayout/index";
import { Input, Button, Link } from "../../../components/atoms/index";
import { Error } from "../../../components/molecules/index";
//hocs
import { withUser } from "../../../hocs";
//API
import {
  USER_CONFIRM_TOKEN_MUTATION,
  USER_RESEND_CONFIRMATION_MUTATION
} from "../../../api/Mutations";
//Utils
import { getUrlParam, _isLoggedIn } from "../../../services/utilities";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";

export class ConfirmUser extends React.PureComponent {
  props: {
    userQuery: any,
    confirmEmail: any,
    resendConfirmation: any,
    history: any,
    router: any
  };
  state = {
    confirmToken: "",
    error: false,
    errorMsg: ""
  };
  componentDidMount() {
    console.log(this.props);
    const { user, history } = this.props;

    //Checks if the user clicked on link send
    if (getUrlParam("token")) {
      this.setState({
        confirmToken: getUrlParam("token")
      });
    } else {
      //Checks if a user is login if not redirect to signin page
      if (!_isLoggedIn()) {
        history.push("/signin");
        return;
      }
      //Checks if the user already confirmed, redirect to main page
      if (user.state.profile.confirmed) {
        history.push("/");
        return;
      } else {
        this._onResendConfirmationCode();
      }
    }
  }
  _onSendConfirmationCode = async () => {
    //verifies the user and saves in the DB
    try {
      const { confirmToken } = this.state;
      await this.props.confirmEmail({
        variables: {
          confirmToken
        }
      });
      //redirects the user to the main page
      this.props.history.push("/");
    } catch (e) {
      LogRocket.error({ SendConfirmationCode: e });
      this.setState({
        error: true,
        errorMsg: "The verification code is invalid."
      });
    }
  };
  _onResendConfirmationCode = async () => {
    //If the code is invalid resend a new code
    try {
      const email = this.props.user.state.profile.email;
      await this.props.resendConfirmation({
        variables: {
          email
        }
      });
      this.props.alert.show("Your code has been sent, check your email.");
    } catch (e) {
      LogRocket.error({ ResendConfirmationCode: e });
      this.setState({
        error: true,
        errorMsg: "The verification code is invalid."
      });
    }
  };
  render() {
    const { confirmToken, error, errorMsg } = this.state;
    return (
      <AuthLayout
        title="Please confirm your email"
        description="We like real people, we need to know if it's not a ghost of the internet."
      >
        <label htmlFor="confirmToken" className="sr-only">
          Confirmation Code
        </label>
        <Input
          id="confirmToken"
          value={confirmToken}
          onChange={e => this.setState({ confirmToken: e.target.value })}
          className="form-control"
          placeholder="Confirmation Code"
          required
          autoFocus
        />

        <Button
          className="btn btn-lg  btn-block"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={this._onSendConfirmationCode}
          primary
        >
          Confirm Account
        </Button>
        <Link onClick={this._onResendConfirmationCode}>
          Resend confirmation code?
        </Link>
        <Error show={error}>{errorMsg}</Error>
      </AuthLayout>
    );
  }
}

const confirmUserWithData = compose(
  withUser,
  withAlert,
  graphql(USER_CONFIRM_TOKEN_MUTATION, { name: "confirmEmail" }),
  graphql(USER_RESEND_CONFIRMATION_MUTATION, { name: "resendConfirmation" })
);

export default confirmUserWithData(ConfirmUser);
