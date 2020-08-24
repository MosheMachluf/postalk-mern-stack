import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  disabled,
  children,
  classlink,
  classbtn = "button-primary",
  to,
  type = "submit",
  ...rest
}) => {
  if (to) {
    return (
      <Link {...rest} className={classlink} to={to}>
        {children}
      </Link>
    );
  }
  return (
    <button {...rest} type={type} className={classbtn} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
