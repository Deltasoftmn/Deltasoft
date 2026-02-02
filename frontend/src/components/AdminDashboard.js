import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearStrapiAuth } from '../api';
import NewsManagement from './admin/NewsManagement';
import ContactList from './admin/ContactList';
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
            📧 Холбоо барих / Үнийн санал
          </button>
        </nav>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          Гарах
        </button>
      </aside>
      <main className="admin-main">
        {section === 'news' && <NewsManagement />}
        {section === 'contacts' && <ContactList />}
      </main>
    </div>
  );
};

export default AdminDashboard;
