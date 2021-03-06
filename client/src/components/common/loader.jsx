import React from "react";

const Loader = () => {
  return (
    <div className="center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
