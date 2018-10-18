// @flow
import React, { PureComponent } from "react";
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
import { _logout, _formatUsername } from "../../../services/utilities";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
//API
import { USERNAME_VALIDATION_QUERY } from "../../../api/Queries";
import { UPDATE_USER_MUTATION } from "../../../api/Mutations";

export class Profile extends PureComponent {
  props: {
    updateUser: any,
    client: any,
    router: any
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
    const { error } = this.state;
    let username = _formatUsername(this.state.username);
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
      const userId = this.props.user.state.profile.id;
      //updates the user username and some else info in the DB
      try {
        await this.props.updateUser({
          variables: {
            userId,
            username
          }
        });
        //Shows feedback and updates the localStorage
        this.setState({ username });
        this.props.user.changeUsername(username);
        this.props.alert.success("Change made successfully");
        LogRocket.info("Change made successfully");
        LogRocket.track("Updated username");
      } catch (e) {
        LogRocket.error({ _updateProfile: e });
        this.props.alert.error("Something went wrong, try again...");
      }
    } else {
      LogRocket.warn(
        "This form is feeling lonely, needs affection, needs data."
      );
      this.setState({
        error: true,
        errorMsg: "This form is feeling lonely, needs affection, needs data."
      });
    }
  };
  _onUsernameValidation(getUsername: string) {
    clearTimeout(this.state.timeoutUserName);
    this.setState({
      timeoutUserName: setTimeout(() => {
        //checks is the username is the same as the previous one
        let username = _formatUsername(getUsername);
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
                errorMsg:
                  "With so much name in this world, you had to choose this one. Try another."
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
  _isTheSameUsername(username: string) {
    const { user } = this.props;
    if (user.state.userName === username) {
      LogRocket.warn(
        "If it's the same as before, what's the point of changing?"
      );
      this.setState({
        error: true,
        errorMsg: "If it's the same as before, what's the point of changing?"
      });
      return true;
    }
  }
  render() {
    const { error, errorMsg, onConfirmation } = this.state;
    const { userName, formsesMeta } = this.props.user.state;
    return (
      <div>
        <Confirmation
          title="Are you sure?"
          description="All your endpoints will be changed to the new username. Do not forget to change in your apps."
          show={onConfirmation}
          onCancel={this._showConfirmation}
          onConfirmation={this._updateProfile}
          onConfirmationText="Confirm"
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
                <Text highlight>Username:</Text>
                <Input
                  placeholder="username"
                  defaultValue={userName}
                  onKeyUp={e => this._onUsernameValidation(e.target.value)}
                  onChange={e =>
                    this.setState({ username: e.target.value, error: false })
                  }
                  className="form-control"
                />
                {error ? <Text color="red">{errorMsg}</Text> : ""}
              </div>
              <Button
                onClick={this._showConfirmation}
                className="btn btn-lg btn-primary btn-block"
                primary
              >
                Update profile
              </Button>
            </form>
          </div>
          <div className="col-md-6">
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <Text highlight>Statistics:</Text>
                <Text>
                  We are great analysts, here you have your statistics of your
                  forms.
                </Text>
                <SubTitle>{`${formsesMeta} forms created`}</SubTitle>
              </div>
            </Card>
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <Text highlight>Current Plan:</Text>
                <Text>
                  More plans soon, as the platform is in beta you have access to
                  all features.
                </Text>
                <SubTitle>
                  <span className="badge badge-dark">All the features</span>
                </SubTitle>
              </div>
            </Card>
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <Text highlight>Settings:</Text>
                <Text>
                  This is a dangerous zone, so be careful, here you will find
                  your settings.
                </Text>
                <ul className="list-inline">
                  <li>
                    <Link onClick={_logout}>Log Out</Link>
                  </li>
                  <li>
                    <Link href="http://www.formette.com/docs" target="_blank">
                      Help
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
  withAlert,
  graphql(UPDATE_USER_MUTATION, { name: "updateUser" })
)(Profile);

export default withApollo(profileWithData);
