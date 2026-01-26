import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import QuoteModal from './QuoteModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="nav-content">
          <Link to="/" className="logo">
            <img src="/Logo.png" alt="Deltasoft Logo" className="logo-image" />
          </Link>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>НҮҮР</Link>
            <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>БИДНИЙ ТУХАЙ</Link>
            <Link to="/why-us" className={`nav-item ${location.pathname === '/why-us' ? 'active' : ''}`}>ЯГААД БИД ГЭЖ?</Link>
            <Link to="/works" className={`nav-item ${location.pathname === '/works' ? 'active' : ''}`}>ХИЙСЭН АЖЛУУД</Link>
            <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>ХОЛБОО БАРИХ</Link>
            <button className="quote-btn" onClick={() => setIsQuoteOpen(true)}>ҮНИЙН САНАЛ АВАХ</button>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Нүүр</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>Бидний тухай</Link>
              <Link to="/why-us" onClick={() => setIsMenuOpen(false)}>Ягаад бид гэж?</Link>
              <Link to="/works" onClick={() => setIsMenuOpen(false)}>Хийсэн ажлууд</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Холбоо барих</Link>
              <button
                type="button"
                className="mobile-quote-link"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsQuoteOpen(true);
                }}
              >
                Үнийн санал авах
              </button>
            </div>
          )}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>
      {isQuoteOpen && <QuoteModal onClose={() => setIsQuoteOpen(false)} />}
    </header>
  );
};

export default Header;

