import React from "react";
import ReactDOM from "react-dom";
// eslint-disable-next-line
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
//GraphQL
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";
// eslint-disable-next-line
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";
//Containers
import App from "./containers/App";
import LoginUser from "./containers/User/Login";
import CreateUser from "./containers/User/Create";
import ConfirmUser from "./containers/User/Confirm/index";
//Styles
import { injectGlobal, ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
//Utilities
import LogRocket from "logrocket";

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_API_URL
});

// use the auth0IdToken in localStorage for authorized requests
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      // get the authentication token from local storage if it exists
      if (localStorage.getItem(process.env.REACT_APP_TOKEN)) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem(
          process.env.REACT_APP_TOKEN
        )}`;
      }
      next();
    }
  }
]);

// Create WebSocket client
const wsClient = new SubscriptionClient(
  process.env.REACT_APP_SUBSCRIPTION_URL,
  {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_TOKEN
      )}`
    }
  }
);

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Switch>
            <Route path="/signin" component={LoginUser} />
            <Route path="/signup" component={CreateUser} />
            <Route exact path="/confirm" component={ConfirmUser} />
            <App />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();

const isProduction = false;
if (isProduction) {
  LogRocket.init("hdwf9x/formette", {
    release: "0.1.0"
  });
}

// Global style
// eslint-disable-next-line
injectGlobal`
  body, html {
    margin: 0;
    background: ${theme.color.background};
    font-family: 'Roboto', sans-serif;
  }
  #HW_frame_cont.HW_visible {
    left: 15px !important;
    top: 60px !important;
    z-index: 9999;
  }
`;
