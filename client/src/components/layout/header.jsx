import React from "react";
import Avatar from "../common/avatar";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  return (
    <header className="top-toolbar">
      <div className="container-lg">
        <div className="inner-toolbar">
          <Avatar user={user} classlink="text-white" />

          <div className="logo">
            <Link to="/">
              <img src="/images/logo.png" height="25px" alt="PosTalk-logo" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
