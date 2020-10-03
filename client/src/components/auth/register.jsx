import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import authService from "../../services/authService";
import { toast } from "react-toastify";

class Register extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: {},
    rightPanelActive: false,
  };

  schema = {
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .required()
      .label("First Name"),
    lastName: Joi.string().trim().min(2).max(255).required().label("Last Name"),
    email: Joi.string()
      .trim()
      .min(4)
      .max(255)
      .required()
      .email()
      .label("Email"),
    password: Joi.string().min(6).max(255).required().label("Password"),
    confirmPassword: Joi.string()
      .min(6)
      .max(255)
      .required()
      .label("Confirm Password"),
  };

  doSubmit = async () => {
    const {
      data,
      data: { email, password },
    } = this.state;

    try {
      await authService.register(data);
      await authService.login({ email, password });
      toast.success("Welcome!");

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
        <h1>Create Account</h1>
        <div class="only-mobile my-2 text-center">
          Have An Account ?
          <button onClick={this.props.switchTo} class="button ml-3">
            Login
          </button>
        </div>
        {errors.length && <div className="alert alert-danger">{errors}</div>}

        {this.renderInput("firstName", "First Name")}
        {this.renderInput("lastName", "Last Name")}
        {this.renderInput("email", "Email", "email")}
        {this.renderInput("password", "Password", "password")}
        {this.renderInput("confirmPassword", "Confirm Password", "password")}
        {this.renderButton("Register")}
      </form>
    );
  }
}

export default Register;
