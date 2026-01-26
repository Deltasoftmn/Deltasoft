import React, { useState } from 'react';
import './AdminDashboard.css';
import WebStatistics from './admin/WebStatistics';
import CarouselControl from './admin/CarouselControl';
import QuoteRequests from './admin/QuoteRequests';
import ExcelToPdf from './admin/ExcelToPdf';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('statistics');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-small">Δ</div>
          <h2>Админ Панел</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeSection === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveSection('statistics')}
          >
            📊 Веб Статистик
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'carousel' ? 'active' : ''}`}
            onClick={() => setActiveSection('carousel')}
          >
            🎠 Карауслын Удирдлага
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveSection('quotes')}
          >
            💰 Үнийн Санал
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'excel' ? 'active' : ''}`}
            onClick={() => setActiveSection('excel')}
          >
            📄 Excel → PDF
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Гарах
        </button>
      </div>
      <div className="admin-content">
        {activeSection === 'statistics' && <WebStatistics />}
        {activeSection === 'carousel' && <CarouselControl />}
        {activeSection === 'quotes' && <QuoteRequests />}
        {activeSection === 'excel' && <ExcelToPdf />}
      </div>
    </div>
  );
};

export default AdminDashboard;

