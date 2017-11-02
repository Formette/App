// @flow
import React from "react";
import { graphql, compose } from "react-apollo";
//Components
import AlertContainer from "react-alert";
import AuthLayout from "../components/organisms/AuthLayout";
import { Input, Button, Link, Icon } from "../components/atoms/index";
import { Error, Graphic } from "../components/molecules/index";
//Styles
import Colors from "../styles/Colors";
//API
import { USER_QUERY } from "../api/Queries";
import {
  USER_CONFIRM_TOKEN_MUTATION,
  USER_RESEND_CONFIRMATION_MUTATION
} from "../api/Mutations";
//Utils
import { getUrlParam, _refreshPage } from "../services/utilities";
import { ALERT_OPTIONS } from "../services/Constants";
import LogRocket from "logrocket";

export class ConfirmUser extends React.PureComponent {
  msg: () => mixed;
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
    if (getUrlParam("token")) {
      this.setState({
        confirmToken: getUrlParam("token")
      });
    }
  }
  showAlert(
    type: string = "success",
    text: string = "Some Text",
    color: string = Colors.green,
    icon: string = "fa-link"
  ) {
    this.msg.show(text, {
      time: 3000,
      type,
      icon: <Icon name={icon} color={color} />
    });
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
      const email = this.props.userQuery.user.email;
      await this.props.resendConfirmation({
        variables: {
          email
        }
      });
      this.showAlert(
        "success",
        "Your code has been resent, check your email.",
        Colors.green,
        "fa-envelope"
      );
    } catch (e) {
      LogRocket.error({ ResendConfirmationCode: e });
      this.setState({
        error: true,
        errorMsg: "The verification code is invalid."
      });
    }
  };
  render() {
    if (this.props.userQuery && this.props.userQuery.loading) {
      return <div>Loading</div>;
    }
    if (this.props.userQuery && this.props.userQuery.error) {
      return (
        <Graphic text="Ups! Something went wrong try again." icon="fa-plug">
          <Button
            className="btn btn-lg btn-primary"
            color={Colors.primary}
            onClick={_refreshPage}
          >
            Try Again
          </Button>
        </Graphic>
      );
    }
    if (this.props.userQuery.user === null) {
      this.props.history.push("/signin");
      return true;
    }
    if (this.props.userQuery.user.confirmed) {
      this.props.history.push("/");
      return true;
    }
    const { confirmToken, error, errorMsg } = this.state;
    return (
      <AuthLayout
        title="Please confirm your email"
        description="We like real people, we need to know if it's not a ghost of the internet."
      >
        <AlertContainer ref={(a) => (this.msg = a)} {...ALERT_OPTIONS} />
        <label htmlFor="confirmToken" className="sr-only">
          Confirmation Code
        </label>
        <Input
          id="confirmToken"
          value={confirmToken}
          onChange={(e) => this.setState({ confirmToken: e.target.value })}
          className="form-control"
          placeholder="Confirmation Code"
          required
          autoFocus
        />

        <Button
          className="btn btn-lg btn-primary btn-block"
          style={{ marginTop: 10, marginBottom: 10 }}
          color={Colors.primary}
          onClick={this._onSendConfirmationCode}
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
  graphql(USER_CONFIRM_TOKEN_MUTATION, { name: "confirmEmail" }),
  graphql(USER_RESEND_CONFIRMATION_MUTATION, { name: "resendConfirmation" }),
  graphql(USER_QUERY, { name: "userQuery" })
);

export default confirmUserWithData(ConfirmUser);
