import React from "react";

const Input = ({
  name,
  label,
  error,
  className = "input",
  textarea,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="hide-label">
        {label}
      </label>
      {(textarea === "true" && (
        <textarea
          {...rest}
          name={name}
          id={name}
          cols="30"
          rows="10"
          className={className}
          placeholder={label}
        ></textarea>
      )) || (
        <input
          {...rest}
          name={name}
          id={name}
          className={className}
          placeholder={label}
        />
      )}

      {error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default Input;
