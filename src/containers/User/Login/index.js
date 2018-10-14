// @flow
import React from "react";
import { graphql, compose } from "react-apollo";
//Components
import AuthLayout from "../../../components/organisms/AuthLayout/index";
import { Input, Button, Link } from "../../../components/atoms/index";
import Error from "../../../components/molecules/Error";
//API
import { SIGIN_USER_MUTATION } from "../../../api/Mutations";
import { userSignIn } from "../../../api/Functions";
//Utils
import LogRocket from "logrocket";

class LoginUser extends React.PureComponent {
  props: {
    client: any,
    confirmed: boolean,
    signinUser: any,
    history: any,
    router: any
  };
  state = {
    email: "",
    password: "",
    error: false,
    errorMsg: ""
  };
  _onSignIn = async () => {
    const { email, password } = this.state;
    //Verifies if the inputs are empty or not
    if (email && password) {
      //logs in the user
      const response = await userSignIn(email, password, this.props.signinUser);
      if (response.status) {
        LogRocket.track("Signed In");
        //checks if the user has the email confirmed
        if (response.confirmed) {
          //sends to the dashboard
          this.props.history.push("/");
        } else {
          this.props.history.push("/confirm");
        }
      } else {
        LogRocket.log("Ops! Invalid Email or password.");
        this.setState({
          error: true,
          errorMsg: "Ops! Invalid Email or password."
        });
      }
    } else {
      LogRocket.info(
        "This form is feeling lonely, needs affection, needs data."
      );
      this.setState({
        error: true,
        errorMsg: "This form is feeling lonely, needs affection, needs data."
      });
    }
  };
  _handleKeyEnter = event => {
    if (event.key == "Enter") {
      this._onSignIn();
    }
  };
  render() {
    const { email, password, error, errorMsg } = this.state;
    const { history } = this.props;
    return (
      <AuthLayout description="Welcome back, Come quick! Your forms are waiting for you">
        <label htmlFor="signinEmail" className="sr-only">
          Email address
        </label>
        <Input
          id="signinEmail"
          type="email"
          value={email}
          onChange={e => this.setState({ email: e.target.value, error: false })}
          onKeyPress={this._handleKeyEnter}
          className={`form-control ${error && "is-invalid"}`}
          placeholder="Email address"
          required
          autoFocus
        />

        <label htmlFor="signinPassword" className="sr-only">
          Password
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
          placeholder="Password"
          required
          autoFocus
        />

        <Button
          className="btn btn-lg btn-block"
          onClick={this._onSignIn}
          style={{ marginTop: 10, marginBottom: 10 }}
          primary
        >
          Sign In
        </Button>

        <Link onClick={() => history.push("/signup")}>
          Do not have an account yet? Omg is free.{" "}
          <u>
            <strong>Create here!</strong>
          </u>
        </Link>
        <Error show={error}>{errorMsg}</Error>
      </AuthLayout>
    );
  }
}

const loginUserWithData = compose(
  graphql(SIGIN_USER_MUTATION, { name: "signinUser" })
);

export default loginUserWithData(LoginUser);
