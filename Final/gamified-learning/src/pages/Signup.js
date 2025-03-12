import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => (
  <div className="auth-page">
    <h2>Sign Up</h2>
    <form className="auth-form">
      <input type="text" placeholder="Username" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit" className="btn">Sign Up</button>
    </form>
    <p>
      Already have an account? <Link to="/login">Login</Link>
    </p>
  </div>
);

export default Signup;
