import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/about">Бидний тухай</Link>
          <span className="separator">|</span>
          <a href="#locations">Оффисын байршил</a>
          <span className="separator">|</span>
          <a href="#news">Мэдээ, хэвлэл</a>
          <span className="separator">|</span>
          <Link to="/contact">Холбоо барих</Link>
          <span className="separator">|</span>
          <a href="#logo">Лого</a>
        </div>
        <div className="footer-right">
          <p>© 2026 Deltasoft. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

