import { Component } from "react";
import authService from "../../services/authService";

class Logout extends Component {
  async componentDidMount() {
    await authService.logout();
    window.location = "/account";
  }

  render() {
    return null;
  }
}

export default Logout;
