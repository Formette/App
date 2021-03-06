import React from "react";
import PropTypes from "prop-types";
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
import { _isLoggedIn } from "../../../services/utilities";
import { getUrlParam } from "@vacom/vantage";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
export class ConfirmUser extends React.PureComponent {
  static propTypes = {
    confirmEmail: PropTypes.func.isRequired,
    resendConfirmation: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object,
    intl: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };
  state = {
    confirmToken: "",
    error: false,
    errorMsg: ""
  };
  componentDidMount() {
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
    const { intl, user } = this.props;
    try {
      const { confirmToken } = this.state;
      await this.props.confirmEmail({
        variables: {
          confirmToken
        }
      });
      //updates user account confirmation state
      user.updateAccountConfirmation();
      //redirects the user to the main page
      this.props.history.push("/");
    } catch (e) {
      LogRocket.error({ SendConfirmationCode: e });
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.UserVerificationInvalid)
      });
    }
  };
  _onResendConfirmationCode = async () => {
    //If the code is invalid resend a new code
    const { intl, user, alert, resendConfirmation } = this.props;
    try {
      const email = user.state.profile.email;
      await resendConfirmation({
        variables: {
          email
        }
      });
      alert.show(intl.formatMessage(messages.UserVerificationSend));
    } catch (e) {
      LogRocket.error({ ResendConfirmationCode: e });
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.UserVerificationInvalid)
      });
    }
  };
  render() {
    const { confirmToken, error, errorMsg } = this.state;
    const { intl } = this.props;
    return (
      <AuthLayout
        title={intl.formatMessage(messages.UserVerificationTitle)}
        description={intl.formatMessage(messages.UserVerificationDescription)}
      >
        <label htmlFor="confirmToken" className="sr-only">
          <FormattedMessage
            id="user.account.verification.text.confirm"
            defaultMessage={"Confirmation Code"}
          />
        </label>
        <Input
          id="confirmToken"
          value={confirmToken}
          onChange={e => this.setState({ confirmToken: e.target.value })}
          className="form-control"
          placeholder={intl.formatMessage(
            messages.UserVerificationConfirmPlaceholder
          )}
          required
          autoFocus
        />

        <Button
          className="btn btn-lg  btn-block"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={this._onSendConfirmationCode}
          primary
        >
          <FormattedMessage
            id="user.account.verification.action.confirm"
            defaultMessage={"Confirm Account"}
          />
        </Button>
        <Link onClick={this._onResendConfirmationCode}>
          <FormattedMessage
            id="user.account.verification.action.resend"
            defaultMessage={" Resend confirmation code?"}
          />
        </Link>
        <Error show={error}>{errorMsg}</Error>
      </AuthLayout>
    );
  }
}

const confirmUserWithData = compose(
  withUser,
  injectIntl,
  withAlert,
  graphql(USER_CONFIRM_TOKEN_MUTATION, { name: "confirmEmail" }),
  graphql(USER_RESEND_CONFIRMATION_MUTATION, { name: "resendConfirmation" })
);

export default confirmUserWithData(ConfirmUser);
