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
import { injectGlobal } from "styled-components";
import Colors from "./styles/Colors";
//Utilities
import { API_URL, SUBSCRIPTION_URL, TOKEN } from "./services/Constants";
import LogRocket from "logrocket";

const networkInterface = createNetworkInterface({ uri: API_URL });

// use the auth0IdToken in localStorage for authorized requests
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      // get the authentication token from local storage if it exists
      if (localStorage.getItem(TOKEN)) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem(
          TOKEN
        )}`;
      }
      next();
    }
  }
]);

// Create WebSocket client
const wsClient = new SubscriptionClient(SUBSCRIPTION_URL, {
  reconnect: true,
  connectionParams: {
    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
  }
});

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
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();
LogRocket.init("hdwf9x/formette", {
  release: "0.1.0"
});

// Global style
// eslint-disable-next-line
injectGlobal`
  body, html {
    margin: 0;
    background: ${Colors.background};
    font-family: 'Roboto', sans-serif;
  }
  #HW_frame_cont.HW_visible {
    left: 15px !important;
    top: 60px !important;
    z-index: 9999;
  }
`;
