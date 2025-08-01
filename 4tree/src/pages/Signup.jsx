 import React from "react";
import "./Signup.css"; // Make sure this file exists

function Signup() {
  return (
    <div className="signup-section">
      <div className="signup-box">
        <h2>Create Your Account</h2>
        <input type="email" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <input type="text" placeholder="Enter OTP" />
        <button>Sign Up</button>
      </div>
    </div>
  );
}

export default Signup;
