import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="main-navbar">
      <ul>
        <li data-tooltip="Home">
          <NavLink exact to="/">
            <i className="fas fa-home" />
          </NavLink>
        </li>

        {user && Object.keys(user).length ? (
          <>
            <li data-tooltip="Settings">
              <NavLink to="/account/settings">
                <i className="fas fa-cog" />
              </NavLink>
            </li>
            <li data-tooltip="Logout">
              <NavLink to="/account/logout">
                <i className="fas fa-sign-out-alt" />
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li data-tooltip="login or register">
              <NavLink to="/account">
                <i className="fas fa-user-plus" />
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
