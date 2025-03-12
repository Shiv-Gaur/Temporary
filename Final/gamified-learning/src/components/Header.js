// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Header = () => (
  <header className="site-header">
    {/* Top Bar with Logo and Nav */}
    <div className="header-top">
      <div className="header-brand">
        <img
          src="/assets/abstract.png"
          alt="Hexacode Logo"
          className="brand-logo"
        />
        <h1 className="brand-name">HEXACODE</h1>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/mcq">MCQ</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </div>

    {/* Hero Section */}
    <div className="hero-section">
      <h2>Where learning becomes fun...</h2>
      <p>Revolutionizing Learning with AI & Gamification</p>
      <Link to="/signup" className="btn hero-btn">
        Get Started
      </Link>
    </div>
  </header>
);

export default Header;
