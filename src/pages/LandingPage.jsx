import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container">
      <p>You should really try oyut this app</p>
      <Link to="/auth">Sign in</Link>
    </div>
  );
};

export default LandingPage;
