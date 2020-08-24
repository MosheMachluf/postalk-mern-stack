import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import Form from "./form";

import authService from "../../services/authService";
import userService from "../../services/userService";

class EditProfile extends Form {
  state = {
    userId: "",
    data: {
      firstName: "",
      lastName: "",
      email: "",
      about: "",
      password: "",
      newPassword: "",
    },
    errors: {},
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
    about: Joi.string().trim().min(2).max(2500).allow("").label("About"),
    password: Joi.string().trim().min(6).max(255).allow("").label("Password"),
    newPassword: Joi.string()
      .trim()
      .min(6)
      .max(255)
      .allow("")
      .label("New Password"),
  };

  async componentDidMount() {
    const { _id: userId } = authService.getCurrentUser();
    const {
      data: { firstName, lastName, email, about },
    } = await userService.details(userId);
    this.setState({
      userId,
      data: { firstName, lastName, email, about: about || "" },
    });
  }

  doSubmit = async () => {
    let { userId } = this.state;
    let data = { ...this.state.data };

    if (!data.password || !data.newPassword) {
      delete data.password;
      delete data.newPassword;
    }

    try {
      await userService.editProfile(data);
      toast.success("Your details updated successfully");
      this.props.history.replace(`/profile/${userId}`);
    } catch (err) {
      this.setState({ errors: err.response.data });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        autoComplete="off"
        method="POST"
        className="col-lg-8 mx-auto"
      >
        {errors.length && <div className="alert alert-danger">{errors}</div>}

        {this.renderInput("firstName", "First Name")}
        {this.renderInput("lastName", "Last Name")}
        {this.renderInput("email", "Email", "email")}
        {this.renderInput(
          "about",
          "Tell a little about yourself...",
          "textarea"
        )}
        <h4 className="text-danger">Change Password</h4>
        <hr className="mt-0" />
        {this.renderInput("password", "Current Password", "password")}
        {this.renderInput("newPassword", "New Password", "password")}
        {this.renderButton("Save")}
      </form>
    );
  }
}

export default EditProfile;
