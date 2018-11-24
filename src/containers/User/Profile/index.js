import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { graphql, compose, withApollo } from "react-apollo";
//Components
import {
  SubTitle,
  Input,
  Button,
  Text,
  Link,
  Header
} from "../../../components/atoms";
import { Confirmation, Card } from "../../../components/molecules";
//hocs
import { withUser } from "../../../hocs";
//Utils
import { _logout } from "../../../services/utilities";
import { formatUsername } from "@vacom/vantage";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
//API
import { USERNAME_VALIDATION_QUERY } from "../../../api/Queries";
import { UPDATE_USER_MUTATION } from "../../../api/Mutations";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
export class Profile extends PureComponent {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };
  state = {
    username: "",
    error: false,
    errorMsg: "",
    timeoutUserName: 0,
    onConfirmation: false
  };
  _showConfirmation = () => {
    this.setState(prevState => ({
      onConfirmation: !prevState.onConfirmation
    }));
    LogRocket.track("Opened  modal on change username");
  };
  _updateProfile = async () => {
    const { intl, user, updateUser, alert } = this.props;
    const { error } = this.state;
    let username = formatUsername(this.state.username);
    //hides the confirmation modal
    this.setState(prevState => ({
      onConfirmation: !prevState.onConfirmation
    }));
    //checks is the username is the same as the previous one
    if (this._isTheSameUsername(username)) return;
    //Verifies if the inputs are empty or not
    if (username) {
      if (error) {
        return;
      }
      const userId = user.state.profile.id;
      //updates the user username and some else info in the DB
      try {
        await updateUser({
          variables: {
            userId,
            username
          }
        });
        //Shows feedback and updates the localStorage
        this.setState({ username });
        user.changeUsername(username);
        alert.success("Change made successfully");
        LogRocket.info("Change made successfully");
        LogRocket.track("Updated username");
      } catch (e) {
        LogRocket.error({ _updateProfile: e });
        alert.error(intl.formatMessage(messages.GraphicErrorDescription));
      }
    } else {
      LogRocket.warn(
        "This form is feeling lonely, needs affection, needs data."
      );
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.ErrorFormEmpty)
      });
    }
  };
  _onUsernameValidation(getUsername) {
    clearTimeout(this.state.timeoutUserName);
    const { intl } = this.props;
    this.setState({
      timeoutUserName: setTimeout(() => {
        //checks is the username is the same as the previous one
        let username = formatUsername(getUsername);
        if (this._isTheSameUsername(username)) return;
        this.props.client
          .query({
            query: USERNAME_VALIDATION_QUERY,
            variables: { username }
          })
          .then(res => {
            if (Object.keys(res.data.allUsers).length !== 0) {
              LogRocket.warn(
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
  _isTheSameUsername(username) {
    const { user, intl } = this.props;
    if (user.state.userName === username) {
      LogRocket.warn(
        "If it's the same as before, what's the point of changing?"
      );
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.ErrorFormSame)
      });
      return true;
    }
  }
  render() {
    const { error, errorMsg, onConfirmation } = this.state;
    const { intl, user } = this.props;
    const { userName, formsesMeta } = user.state;
    return (
      <div>
        <Confirmation
          title={intl.formatMessage(messages.ModalProfileChangeTitle)}
          description={intl.formatMessage(
            messages.ModalProfileChangeDescription
          )}
          show={onConfirmation}
          onConfirmationText={intl.formatMessage(
            messages.ModalProfileChangeActionTextPrimary
          )}
          onCancelText={intl.formatMessage(
            messages.ModalProfileChangeActionTextCancel
          )}
          onCancel={this._showConfirmation}
          onConfirmation={this._updateProfile}
          actionProps={{ primary: true }}
        />
        <div className="row">
          <div className="col-md-12">
            <Header>{`Hey, ${this.state.username || userName}`}</Header>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <Text highlight>
                  <FormattedMessage
                    id="user.account.create.text.username"
                    defaultMessage={"Username"}
                  />
                </Text>
                <Input
                  placeholder={intl.formatMessage(
                    messages.UserCreateTextUsername
                  )}
                  defaultValue={userName}
                  onKeyUp={e => this._onUsernameValidation(e.target.value)}
                  onChange={e =>
                    this.setState({ username: e.target.value, error: false })
                  }
                  className={`form-control ${error && "is-invalid"}`}
                />
                {error ? <Text color="red">{errorMsg}</Text> : ""}
              </div>
              <Button
                onClick={this._showConfirmation}
                className="btn btn-lg btn-primary btn-block"
                primary
              >
                <FormattedMessage
                  id="app.page.profile.action.update"
                  defaultMessage={"Update profile"}
                />
              </Button>
            </form>
          </div>
          <div className="col-md-6">
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <Text highlight>
                  <FormattedMessage
                    id="app.page.profile.text.statistics"
                    defaultMessage={"Statistics"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.profile.text.statistics.description"
                    defaultMessage={
                      "We are great analysts, here you have your statistics of your forms."
                    }
                  />
                </Text>
                <SubTitle>
                  {`${formsesMeta} `}
                  <FormattedMessage
                    id="app.page.profile.text.statistics.forms.count"
                    defaultMessage={"forms created"}
                  />
                </SubTitle>
              </div>
            </Card>
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <Text highlight>
                  <FormattedMessage
                    id="app.page.profile.text.plan"
                    defaultMessage={"Current Plan"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.profile.text.plan.description"
                    defaultMessage={
                      "More plans soon, as the platform is in beta you have access to all features."
                    }
                  />
                </Text>
                <SubTitle>
                  <span className="badge badge-dark">
                    <FormattedMessage
                      id="app.page.profile.text.plan.type"
                      defaultMessage={"All the features"}
                    />
                  </span>
                </SubTitle>
              </div>
            </Card>
            <Card style={{ marginTop: 10, marginBottom: 10 }}>
              <div className="card-body">
                <Text highlight>
                  <FormattedMessage
                    id="app.page.profile.text.settings"
                    defaultMessage={"Settings"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.profile.text.settings.description"
                    defaultMessage={
                      "This is a dangerous zone, so be careful, here you will find your settings."
                    }
                  />
                </Text>
                <ul className="list-inline">
                  <li>
                    <Link onClick={_logout}>
                      <FormattedMessage
                        id="app.page.profile.text.settings.action.logout"
                        defaultMessage={"Log Out"}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="http://www.formette.com/docs" target="_blank">
                      <FormattedMessage
                        id="app.page.profile.text.settings.action.help"
                        defaultMessage={"Help"}
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const profileWithData = compose(
  withUser,
  injectIntl,
  withAlert,
  graphql(UPDATE_USER_MUTATION, { name: "updateUser" })
)(Profile);

export default withApollo(profileWithData);
