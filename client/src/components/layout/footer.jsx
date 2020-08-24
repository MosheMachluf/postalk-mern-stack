import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white tac text-muted border-top p-3">
      PosTalk App &copy; {new Date().getFullYear()} By Moshe Machluf
    </footer>
  );
};

export default Footer;
