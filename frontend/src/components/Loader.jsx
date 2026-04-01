// components/Loader.jsx
import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div className="loader-center">
    <div className="spinner" />
    <p>{text}</p>
  </div>
);

export default Loader;
