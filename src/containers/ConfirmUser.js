// @flow
import React from "react";
import { graphql, compose } from "react-apollo";
//Components
import AuthLayout from "../components/organisms/AuthLayout";
import { Input, Button, Link } from "../components/atoms/index";
import Error from "../components/molecules/Error";
//Styles
import Colors from "../styles/Colors";
//API
import {USER_CONFIRM_TOKEN_MUTATION, USER_RESEND_CONFIRMATION_MUTATION } from "../api/Mutations";
//Utils
import {_saveEmailConfirmation} from '../services/utilities';
import LogRocket from 'logrocket';


export class ConfirmUser extends React.PureComponent {
  props: {
    confirmEmail: any,
    resendConfirmation: any,
    history: any,
    router: any
  };
  state = {
    confirmToken: "",
    error: false,
    errorMsg: "",
  };
  _onSendConfirmationCode = async () =>{
      try {
          const {confirmToken} = this.state;
          await this.props.confirmEmail({
              variables: {
                  confirmToken
              }
          });
          _saveEmailConfirmation(true);
          //redirects the user to the main page
          this.props.history.push("/");
      } catch (e) {
          console.error(e);
          LogRocket.error({'SendConfirmationCode': e});
          this.setState({
              error: true,
              errorMsg: "The verification code is invalid."
          });
      }
  };
  _onResendConfirmationCode = async () =>{

  };
  render() {
    const { confirmToken, error, errorMsg } = this.state;
    return (
      <AuthLayout title="Please confirm your email" description="We like real people, we need to know if it's not a ghost of the internet.">
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

const ConfirmUserWithData = compose(
  graphql(USER_CONFIRM_TOKEN_MUTATION, { name: "confirmEmail" }),
  graphql(USER_RESEND_CONFIRMATION_MUTATION, { name: "resendConfirmation" })
);

export default ConfirmUserWithData(ConfirmUser);
