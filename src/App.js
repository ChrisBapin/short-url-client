import React, { Component } from "react";
import "./assets/reset.css";
import Home from "./containers/Home";
import Redirection from "./containers/Redirection";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              exact={true}
              path="/"
              render={props => <Home {...props} />}
            />
            <Route
              path="/:shorturl"
              render={props => <Redirection {...props} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
