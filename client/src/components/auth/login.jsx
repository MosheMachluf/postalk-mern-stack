import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import authService from "../../services/authService";
import { toast } from "react-toastify";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().trim().required().email().label("Email"),
    password: Joi.string().trim().required().min(6).label("Password"),
  };

  doSubmit = async () => {
    const { data } = this.state;

    try {
      await authService.login(data);
      toast.success("Welcome Back!");

      window.location = "/";
    } catch (err) {
      if (err.response && err.response.status === 400) {
        this.setState({ errors: err.response.data });
      }
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        autoComplete="off"
        method="POST"
        className="form"
      >
        <h1>Login</h1>
        {errors.length && <div className="alert alert-danger">{errors}</div>}
        {this.renderInput("email", "Email", "email")}
        {this.renderInput("password", "Password", "password")}

        {this.renderButton("Login")}
      </form>
    );
  }
}

export default Login;
