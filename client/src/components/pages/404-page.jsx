import React from "react";
import Button from "../common/button";

const PageNotFound = () => {
  return (
    <div className="p-5" style={{ height: "85vh" }}>
      <Button to="/" classlink="button">
        <i className="fas fa-arrow-circle-left" /> Back Home
      </Button>
      <div className="card p-5">
        <h1 className="text-danger tac">404 Page Not Found</h1>
      </div>
    </div>
  );
};

export default PageNotFound;
