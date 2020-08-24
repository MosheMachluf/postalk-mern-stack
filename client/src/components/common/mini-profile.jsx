import React from "react";
import Preloader from "./preloader";
import Avatar from "./avatar";
import { fullName, dateFormat } from "../../services/helpers";
import Button from "./button";

const MiniProfile = ({ user }) => {
  return (
    <>
      {(!user && <Preloader />) ||
        (Object.keys(user).length ? (
          <div className="mini-profile card capitalize">
            <div style={{ width: "100%", height: "250px" }}></div>

            <div className="bg-overlay">
              <Avatar user={user} withName={false} width="150px" borderWhite />

              <div className="tac" style={{ marginTop: "5rem" }}>
                <h2>Hello {fullName(user)}</h2>
                <p className="card-text">
                  Last Login: {dateFormat(user.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning border border-warning p-4">
            <h1 className="display-4">Hey Friend!</h1>
            <p className="lead">
              We so glad to see you. We are "PostTalk" a social application that
              connects people through conversations in posts. If you want to
              talk to people sign up now and start posting posts or posting
              comments on existing posts
            </p>
            <hr className="my-4" />
            <p className="tac">
              <Button classlink="button button-primary p-4" to="/account">
                Please login or resgiter now!
              </Button>
            </p>
          </div>
        ))}
    </>
  );
};

export default MiniProfile;
