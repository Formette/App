import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import registerServiceWorker from './registerServiceWorker';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { injectGlobal } from 'styled-components';
//Containers
import App from './components/App';
import MyForms from './containers/MyForms';
import NewForm from './containers/NewForm';
import FormDetails from './containers/FormDetails';
import Profile from './containers/Profile';
import LoginUser from './containers/LoginUser';
import CreateUser from './containers/CreateUser';
import NoMatch from './containers/NoMatch';
//Styles
import Colors from './styles/Colors';
//Utilities
import {_isLoggedIn} from './services/utilities';
import {API_URL, TOKEN} from './services/Constants';

const networkInterface = createNetworkInterface({ uri: API_URL });

// use the auth0IdToken in localStorage for authorized requests
networkInterface.use([{
    applyMiddleware (req, next) {
        if (!req.options.headers) {
            req.options.headers = {}
        }

        // get the authentication token from local storage if it exists
        if (localStorage.getItem(TOKEN)) {
            req.options.headers.authorization = `Bearer ${localStorage.getItem(TOKEN)}`
        }
        next()
    },
}]);

const client = new ApolloClient({ networkInterface });

//Verifies if the user is logggedIn, if not redirect to login page
function requireAuth(nextState, replace) {
    if(!_isLoggedIn()) {
        replace({
            pathname: '/signin',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

ReactDOM.render((
        <ApolloProvider client={client}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={MyForms} onEnter={requireAuth}/>
                    <Route path="/new" component={NewForm} onEnter={requireAuth}/>
                    <Route path="/form(/:id)" component={FormDetails} onEnter={requireAuth}/>
                    <Route path="/profile" component={Profile} onEnter={requireAuth}/>
                </Route>
                <Route path='signin' component={LoginUser} />
                <Route path='signup' component={CreateUser} />
                <Route path='*' component={NoMatch} />
            </Router>
        </ApolloProvider>
    ),
    document.getElementById('root')
);

registerServiceWorker();

// Global style
// eslint-disable-next-line
injectGlobal`
  body, html {
    height: 100%;
    margin: 0;
    background: ${Colors.background};
    font-family: 'Roboto', sans-serif;
  }
`;
