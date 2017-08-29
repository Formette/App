import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { injectGlobal } from 'styled-components';
//Containers
import App from './components/App';
import LoginUser from './containers/LoginUser';
import CreateUser from './containers/CreateUser';
//Styles
import Colors from './styles/Colors';
//Utilities
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

ReactDOM.render((
        <ApolloProvider client={client}>
            <Router>

                <div>
                    <Switch>
                        <Route  path='/signin' component={LoginUser} />
                        <Route  path='/signup' component={CreateUser} />
                        <App/>
                    </Switch>
                </div>
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
