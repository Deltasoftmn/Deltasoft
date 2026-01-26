import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a href="#about">About Us</a>
          <span className="separator">|</span>
          <a href="#sustainability">Sustainability</a>
          <span className="separator">|</span>
          <a href="#locations">Office Locations</a>
          <span className="separator">|</span>
          <a href="#news">News & Press</a>
          <span className="separator">|</span>
          <a href="#careers">Careers</a>
          <span className="separator">|</span>
          <a href="#contact">Contact Us</a>
          <span className="separator">|</span>
          <a href="#logo">Logo</a>
        </div>
        <div className="footer-right">
          <p>© 2024 Deltasoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

