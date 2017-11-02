// @flow
import React, { PureComponent } from "react";
import { graphql, compose, withApollo } from "react-apollo";
//Components
import {
  Header,
  SubTitle,
  Title,
  Input,
  Button,
  Text,
  Link
} from "../components/atoms/index";
import { Graphic, Confirmation } from "../components/molecules/index";
//Styles
import Colors from "../styles/Colors";
//Utils
import {
  _getUsername,
  _logout,
  _saveUsername,
  _refreshPage,
  _formatUsername
} from "../services/utilities";
import LogRocket from "logrocket";
//API
import { USER_QUERY, USERNAME_VALIDATION_QUERY } from "../api/Queries";
import { UPDATE_USER_MUTATION } from "../api/Mutations";

export class Profile extends PureComponent {
  props: {
    userQuery: any,
    updateUser: any,
    client: any,
    router: any,
    updateUsername: any,
    showMessage: () => mixed
  };
  state = {
    username: "",
    error: false,
    errorMsg: "",
    timeoutUserName: 0,
    onConfirmation: false
  };
  componentDidMount() {
    this.setState({ username: _getUsername() });
  }
  _showConfirmation = () => {
    this.setState((prevState) => ({
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
      const userId = this.props.userQuery.user.id;
      //updates the user username and some else info in the DB
      try {
        await this.props.updateUser({
          variables: {
            userId,
            username
          }
        });
        //Shows feedback and updates the localStorage
        _saveUsername(username);
        this.setState({ username });
        //this updates the navbar to the new username
        this.props.updateUsername();
        this.props.showMessage(
          "success",
          "Change made successfully",
          undefined,
          undefined
        );
        LogRocket.info("Change made successfully");
        LogRocket.track("Updated username");
      } catch (e) {
        LogRocket.error({ _updateProfile: e });
        this.props.showMessage(
          "error",
          "Something went wrong, try again...",
          Colors.red,
          "fa-times"
        );
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
          .then((res) => {
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
          .catch((e) => {
            LogRocket.error({ _onUsernameValidation: e });
          });
      }, 500)
    });
  }
  _isTheSameUsername(username: string) {
    if (_getUsername() === username) {
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
    const { userName, _formsesMeta } = this.props.userQuery.user;
    const { error, errorMsg, username, onConfirmation } = this.state;
    return (
      <div>
        <Confirmation
          title="Are you sure?"
          description="All your endpoints will be changed to the new username. Do not forget to change in your apps."
          show={onConfirmation}
          onCancel={this._showConfirmation}
          onConfirmation={this._updateProfile}
          onConfirmationText="Confirm"
          onConfirmationColor={Colors.green}
        />
        <div className="row">
          <div className="col-md-12">
            <Header text={`Hey, ${username}`} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle text="Username:" color={Colors.text.secondary} />
                <Input
                  placeholder="username"
                  defaultValue={userName}
                  onKeyUp={(e) => this._onUsernameValidation(e.target.value)}
                  onChange={(e) =>
                    this.setState({ username: e.target.value, error: false })}
                  className="form-control"
                />
                {error ? <Text text={errorMsg} color={Colors.red} /> : ""}
              </div>
              <Button
                onClick={this._showConfirmation}
                color={Colors.primary}
                className="btn btn-lg btn-primary btn-block"
              >
                Update profile
              </Button>
            </form>
          </div>
          <div className="col-md-6">
            <div className="card" style={{ marginTop: 10 }}>
              <div className="card-body">
                <SubTitle text="Statistics:" color={Colors.text.secondary} />
                <Text
                  text="We are great analysts, here you have your statistics of your forms."
                  color={Colors.text.secondary}
                />
                <Title text={`${_formsesMeta.count} forms created`} />
              </div>
            </div>
            <div className="card" style={{ marginTop: 10 }}>
              <div className="card-body">
                <SubTitle text="Current Plan:" color={Colors.text.secondary} />
                <Text
                  text="More plans soon, as the platform is in beta you have access to all features."
                  color={Colors.text.secondary}
                />

                <h2>
                  <span className="badge badge-dark">All the features</span>
                </h2>
              </div>
            </div>
            <div className="card" style={{ marginTop: 10 }}>
              <div className="card-body">
                <SubTitle text="Settings:" color={Colors.text.secondary} />
                <Text
                  text="This is a dangerous zone, so be careful, here you will find your settings."
                  color={Colors.text.secondary}
                />
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const profileWithData = compose(
  graphql(USER_QUERY, { name: "userQuery" }),
  graphql(UPDATE_USER_MUTATION, { name: "updateUser" })
)(Profile);

export default withApollo(profileWithData);
