import React, { Component } from "react";
import Input from "./input";
import Joi from "joi-browser";
import Button from "./button";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate() {
    const options = { abortEarly: true };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    const errors = {};
    for (let item of error.details)
      errors[item.path[0]] = item.message.replace(/"/g, "");
    return errors;
  }

  validateProperty({ name, value }) {
    const { password, confirmPassword } = this.state.data;
    const p = name === "password" ? value : password;
    const cp = name === "confirmPassword" ? value : confirmPassword;

    if (name === "confirmPassword") {
      return p === cp ? null : "Passwords don't match";
    } else {
      const obj = { [name]: value };
      const schema = { [name]: this.schema[name] };
      const { error } = Joi.validate(obj, schema);
      return error ? error.details[0].message.replace(/"/g, "") : null;
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  renderButton(label) {
    return (
      <Button disabled={this.validate()} classbtn="button button-primary">
        {label}
      </Button>
    );
  }

  renderInput(name, label, type = "text", className) {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        className={className}
        onChange={this.handleChange}
        value={data[name]}
        error={errors[name]}
        textarea={type === "textarea" ? "true" : "false"}
      />
    );
  }
}

export default Form;
