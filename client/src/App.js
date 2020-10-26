import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Account from "./components/auth/account";
import Logout from "./components/auth/logout";
import AppRoute from "./components/common/app-route";
import Layout from "./components/layout/layout";
import Home from "./components/pages/home";
import Profile from "./components/pages/profile";
import PageNotFound from "./components/pages/404-page";
import Settings from "./components/pages/settings";

import authService from "./services/authService";
import userService from "./services/userService";

class App extends Component {
  state = {};

  async componentDidMount() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return this.setState({ user: {} });
    try {
      const { data: user } = await userService.details(currentUser._id);
      this.setState({ user });
    } catch (err) {
      this.setState({ user: {} });
    }
  }

  render() {
    const { user } = this.state;

    return (
      <Switch>
        <AppRoute exact path="/" layout={Layout} component={Home} user={user} />
        <AppRoute
          exact
          path="/profile/:userId"
          layout={Layout}
          component={Profile}
          user={user}
          protected={true}
        />
        <Route exact path="/account" component={Account} user={user} />
        <AppRoute
          exact
          path="/account/settings"
          layout={Layout}
          component={Settings}
          user={user}
          protected={true}
        />
        <Route exact path="/account/logout" component={Logout} user={user} />
        <AppRoute
          exact
          path="/page-not-found"
          layout={Layout}
          component={PageNotFound}
          user={user}
        />
        <Route
          exact
          path="*"
          render={() => <Redirect to="/page-not-found" />}
        />
      </Switch>
    );
  }
}

export default App;
