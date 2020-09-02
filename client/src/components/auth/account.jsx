import React, { Component } from "react";
import Login from "./login";
import Register from "./register";
import authService from "../../services/authService";
import { Redirect } from "react-router-dom";

class Account extends Component {
  state = {
    rightPanelActive: false,
  };

  switchTo = () => {
    let { rightPanelActive } = this.state;
    rightPanelActive = !rightPanelActive;
    this.setState({ rightPanelActive });
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/" />;
    const { rightPanelActive } = this.state;

    return (
      <div className="center">
        <div
          className={`centered-container ${
            rightPanelActive ? "right-panel-active" : ""
          }`}
        >
          <div className="form-container register-form">
            <Register />
          </div>

          <div className="form-container login-form">
            <Login />
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>Already have an account with us?</p>
                <button className="ghost" onClick={this.switchTo}>
                  Login
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Still don't have an account with us?</p>
                <button className="ghost" onClick={this.switchTo}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
