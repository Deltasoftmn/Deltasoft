import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearStrapiAuth } from '../api';
import NewsManagement from './admin/NewsManagement';
import ContactList from './admin/ContactList';
import TonogTuhuurumjList from './admin/TonogTuhuurumjList';
import HolbooBarihList from './admin/HolbooBarihList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState(
    location.state?.section || 'news'
  );

  const handleLogout = () => {
    clearStrapiAuth();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">Δ</span>
          <h2>Админ</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={section === 'news' ? 'active' : ''}
            onClick={() => setSection('news')}
          >
            📰 Мэдээ
          </button>
          <button
            type="button"
            className={section === 'contacts' ? 'active' : ''}
            onClick={() => setSection('contacts')}
          >
            📧 Үнийн санал
          </button>
          <button
            type="button"
            className={section === 'tonog' ? 'active' : ''}
            onClick={() => setSection('tonog')}
          >
            🔧 Тоног төхөөрөмж, худалдаа, засвар
          </button>
          <button
            type="button"
            className={section === 'holboo' ? 'active' : ''}
            onClick={() => setSection('holboo')}
          >
            📬 Холбоо барих
          </button>
        </nav>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          Гарах
        </button>
      </aside>
      <main className="admin-main">
        {section === 'news' && <NewsManagement />}
        {section === 'contacts' && <ContactList />}
        {section === 'tonog' && <TonogTuhuurumjList />}
        {section === 'holboo' && <HolbooBarihList />}
      </main>
    </div>
  );
};

export default AdminDashboard;
