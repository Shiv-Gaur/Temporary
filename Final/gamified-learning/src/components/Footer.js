// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Footer = () => (
  <footer>
    <div className="footer-container">
      <p>&copy; 2025 Hexacode. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <div className="social-icons">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/facebook.png" alt="Facebook" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/assets/icons/twitter.png" alt="Twitter" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/linkedin.png" alt="LinkedIn" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
