import React from "react";
import { Route, Redirect } from "react-router-dom";

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (rest.protected && !rest.user)
        return (
          <Redirect
            to={{ pathname: "/account", state: { from: props.location } }}
          />
        );
      if (Layout)
        return (
          <Layout {...rest}>
            <Component {...props} />
          </Layout>
        );
      return <Component {...rest} {...props} />;
    }}
  />
);
export default AppRoute;
