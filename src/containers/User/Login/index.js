// @flow
import React, { Fragment } from "react";
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

class LoginUser extends React.PureComponent {
  props: {
    client: any,
    confirmed: boolean,
    signinUser: any,
    history: any,
    router: any
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
    //Verifies if the inputs are empty or not
    if (email && password) {
      //logs in the user
      const response = await userSignIn(email, password, this.props.signinUser);
      if (response.status) {
        LogRocket.track("Signed In");
        this.props.user.updateUser(response.rest);
        //sends to the dashboard
        this.props.history.push("/");
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
    if (event.key === "Enter") {
      this._onSignIn();
    }
  };
  render() {
    const { email, password, error, errorMsg } = this.state;
    const { history } = this.props;
    return (
      <Fragment>
        <AuthLayout description="Welcome back, Come quick! Your forms are waiting for you">
          <label htmlFor="signinEmail" className="sr-only">
            Email address
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
        <Footer />
      </Fragment>
    );
  }
}

const loginUserWithData = compose(
  withUser,
  graphql(SIGIN_USER_MUTATION, { name: "signinUser" })
);

export default loginUserWithData(LoginUser);
