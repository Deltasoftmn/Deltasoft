import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearStrapiAuth, getStrapiUser, isWorkerUser } from '../api';
import NewsManagement from './admin/NewsManagement';
import ContactList from './admin/ContactList';
import TonogTuhuurumjList from './admin/TonogTuhuurumjList';
import HolbooBarihList from './admin/HolbooBarihList';
import ShideluudList from './admin/ShideluudList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState(
    location.state?.section || 'news'
  );

  // Workers must use worker dashboard; redirect if they land here (avoids News fetch 403)
  const user = getStrapiUser();
  const isWorker = isWorkerUser(user);
  useEffect(() => {
    if (isWorker) {
      navigate('/admin/worker-dashboard', { replace: true });
    }
  }, [isWorker, navigate]);

  const handleLogout = () => {
    clearStrapiAuth();
    navigate('/admin', { replace: true });
  };

  // Don't render admin content for workers (prevents News fetch before redirect)
  if (isWorker) {
    return (
      <div className="admin-dashboard" style={{ padding: '2rem', color: 'rgba(255,255,255,0.8)' }}>
        Ажилтны самбар руу шилжиж байна...
      </div>
    );
  }

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
          <button
            type="button"
            className={section === 'shideluud' ? 'active' : ''}
            onClick={() => setSection('shideluud')}
          >
            📋 Шийдлүүд
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
        {section === 'shideluud' && <ShideluudList />}
      </main>
    </div>
  );
};

export default AdminDashboard;
