import React from "react";

const style = {
  background: "#fff",
  padding: "1rem 1.5rem",
  color: "#888",
  marginBottom: "1.5rem",
  borderBottom: "1px solid #dee2e6",
};

const PageHeader = ({ title }) => {
  return (
    <div className="page-header" style={style}>
      <h1 className="h4 capitalize text-left">{title}</h1>
    </div>
  );
};

export default PageHeader;
