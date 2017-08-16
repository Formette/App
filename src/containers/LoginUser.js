// @flow
import React from 'react';
import { graphql, compose } from 'react-apollo'
//Components
import AuthLayout from '../components/organisms/AuthLayout';
import {Input, Button, Link} from '../components/atoms/index';
import Error from '../components/molecules/Error';
//Styles
import Colors from '../styles/Colors';
//API
import {SIGIN_USER_MUTATION} from '../api/Mutations';
//Utilities
import {_saveUsername, _saveUserId} from '../services/utilities';

class LoginUser extends React.PureComponent {
    props: {
        signinUser: any,
        router: any,
    };
    state = {
        email: "",
        password: "",
        error: false,
        errorMsg: ""
    };
    _onSignIn = _ => {
      const {email, password} = this.state;
        //Verifies if the inputs are empty or not
        if(email && password) {
            //logs in the user
            this.props.signinUser({variables: {email, password}})
                .then((res) => {
                    window.localStorage.setItem('graphcoolToken', res.data.signinUser.token);
                    _saveUsername(res.data.signinUser.user.userName);
                    _saveUserId(res.data.signinUser.user.id);
                }).then(_ => this.props.router.replace('/'))
                .catch((e) => {
                    console.log(e);
                    this.setState({error: true, errorMsg: "Ops! Invalid Email or password."});
                })
        }else{
            this.setState({
                error: true,
                errorMsg: "This form is feeling lonely, needs affection, needs data."
            });
        }
    };
    render(){
        const {email, password, error, errorMsg} = this.state;
        return(
           <AuthLayout description="Welcome back, Come quick! Your forms are waiting for you">
               <label htmlFor="signinEmail" className="sr-only">Email address</label>
                   <Input id="signinEmail"
                          type="email"
                          value={email}
                          onChange={(e) => this.setState({email: e.target.value})}
                          className="form-control"
                          placeholder="Email address"
                          required autoFocus/>

               <label htmlFor="signinPassword" className="sr-only">Password</label>
                   <Input id="signinPassword"
                          type="password"
                          value={password}
                          onChange={(e) => this.setState({password: e.target.value})}
                          className="form-control"
                          placeholder="Password"
                          required autoFocus/>

               <Button className="btn btn-lg btn-primary btn-block"
                       onClick={this._onSignIn}
                       style={{marginTop: 10, marginBottom: 10}}
                       color={Colors.primary}>Sign In</Button>

               <Link href="/signup">Do not have an account yet? Omg is free. <u><strong>Create here!</strong></u></Link>
               <Error show={error}>{errorMsg}</Error>
           </AuthLayout>
        )
    }
}

const LoginUserWithData = compose(
    graphql(SIGIN_USER_MUTATION, {name: 'signinUser'}),
);

export default LoginUserWithData(LoginUser);


