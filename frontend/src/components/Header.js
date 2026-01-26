import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import QuoteModal from './QuoteModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="top-banner-content">
          <div className="top-banner-text">Ухаалаг шийдлээр Урагш алхана</div>
          <div className="top-banner-phone">
            <span className="phone-icon">📞</span>
            <a href="tel:+97675331177" className="phone-number">+976 75331177</a>
            <a href="tel:+97689781177" className="phone-number">+976 89781177</a>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="nav-content">
          <Link to="/" className="logo">
            <img src="/Logo.png" alt="Deltasoft Logo" className="logo-image" />
          </Link>
          <div className="nav-links">
            <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>Бидний тухай</Link>
            <div 
              className="dropdown"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <div className={`nav-item dropdown-trigger ${isServicesDropdownOpen ? 'active' : ''}`}>
                Манай үйлчилгээ
                <span className="dropdown-arrow">▼</span>
              </div>
              {isServicesDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    Гэрээт ІТ үйлчилгээ
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    МАБ-ын Outsourcing үйлчилгээ
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    Вэб сайт, Програм хангамж хөгжүүлэлт
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    Social хуудас болон контент хөгжүүлэлт
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsServicesDropdownOpen(false)}>
                    Дэлгэцийн реклам
                  </Link>
                </div>
              )}
            </div>
            <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>Холбоо барих</Link>
            <button className="quote-btn" onClick={() => setIsQuoteOpen(true)}>Үнийн санал авах</button>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <button 
                className="mobile-menu-close"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsServicesDropdownOpen(false);
                }}
              >
                ✕
              </button>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>Бидний тухай</Link>
              <div className="mobile-dropdown">
                <div className="mobile-dropdown-trigger" onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}>
                  Манай үйлчилгээ {isServicesDropdownOpen ? '▲' : '▼'}
                </div>
                {isServicesDropdownOpen && (
                  <div className="mobile-dropdown-menu">
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>Гэрээт ІТ үйлчилгээ</Link>
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>МАБ-ын Outsourcing үйлчилгээ</Link>
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>Вэб сайт, Програм хангамж хөгжүүлэлт</Link>
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ</Link>
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>Social хуудас болон контент хөгжүүлэлт</Link>
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsServicesDropdownOpen(false); }}>Дэлгэцийн реклам</Link>
                  </div>
                )}
              </div>
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
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isMenuOpen) {
                setIsServicesDropdownOpen(false);
              }
            }}
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

