import React, { Component } from "react";
import { withApollo } from "react-apollo";
//API
import { USER_QUERY } from "../api/Queries";

const UserContext = React.createContext();

class Provider extends Component {
  state = {
    userName: "username",
    formsesMeta: 0,
    profile: []
  };
  componentDidMount() {
    this._getCurrentUser();
  }
  _getCurrentUser = async () => {
    try {
      const res = await this.props.client.query({
        query: USER_QUERY
      });
      if (!res.loading) {
        const { user } = res.data;
        const { userName, _formsesMeta } = user;
        this.setState({
          userName,
          formsesMeta: _formsesMeta.count,
          profile: user
        });
      }
    } catch (error) {
      console.log("provider error = ", error);
    }
  };
  _changeUsername = str => {
    this.setState({ userName: str });
  };
  _updateUser = data => {
    const { userName, _formsesMeta, ...profile } = data;
    this.setState({
      userName,
      formsesMeta: _formsesMeta.count,
      profile
    });
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          state: this.state,
          changeUsername: this._changeUsername,
          updateUser: this._updateUser
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

const UserProvider = withApollo(Provider);

export { UserContext, UserProvider };
