import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const openMap = (e) => {
    e.preventDefault();
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/about">Бидний тухай</Link>
          <span className="separator">|</span>
          <button type="button" className="footer-link-button" onClick={openMap}>
            Оффисын байршил
          </button>
          <span className="separator">|</span>
          <Link to="/news">Мэдээ, хэвлэл</Link>
          <span className="separator">|</span>
          <Link to="/contact">Холбоо барих</Link>
          <span className="separator">|</span>
          <a href="/Logo.png" download="deltasoft-logo.png">Лого</a>
        </div>
        <div className="footer-right">
          <p>© 2026 Deltasoft. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>

      {isMapOpen && (
        <div className="footer-map-backdrop" onClick={closeMap}>
          <div className="footer-map-modal" onClick={(e) => e.stopPropagation()}>
            <div className="footer-map-header">
              <h2>Оффисын байршил</h2>
              <button
                type="button"
                className="footer-map-close"
                onClick={closeMap}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="footer-map-address">
              Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 8-р хороо, GB центр 2-р давхар
              202 тоот
            </p>
            <div className="footer-map-frame">
              <iframe
                title="Deltasoft Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2708.081537630433!2d106.92087047373694!3d47.925889106090885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693d77a4c4e01%3A0xea65c3e5f9df586!2zR0Ig0YbQtdC90YLRgA!5e0!3m2!1sen!2smn!4v1770195213361!5m2!1sen!2smn"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

