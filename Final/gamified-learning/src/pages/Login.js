import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => (
  <div className="auth-page">
    <h2>Login</h2>
    <form className="auth-form">
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit" className="btn">Login</button>
    </form>
    <p>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </p>
  </div>
);

export default Login;
