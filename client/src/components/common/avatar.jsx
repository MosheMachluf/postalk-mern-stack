import React from "react";
import { Link } from "react-router-dom";
import { fullName, uploadsUrl } from "../../services/helpers";

const Avatar = ({
  user,
  withName = true,
  width = "40px",
  classlink,
  borderWhite,
}) => {
  const style = {
    width: width,
    height: width,
    objectFit: "cover",
  };

  const classOnline = `border border-3 ${
    user?.online ? "border-success" : "border-danger"
  }`;

  const classes = `rounded-circle ${
    borderWhite ? "border-shadow" : classOnline
  }`;

  return (
    <>
      {user && Object.keys(user).length > 0 && (
        <div className="avatar">
          <Link to={`/profile/${user._id}`} className={classlink}>
            <img
              src={uploadsUrl + user.avatar}
              className={classes}
              style={style}
              alt={`${fullName(user)} avatar`}
            />

            {withName && (
              <small className="ml-2 capitalize">{fullName(user)}</small>
            )}
          </Link>
        </div>
      )}
    </>
  );
};

export default Avatar;
