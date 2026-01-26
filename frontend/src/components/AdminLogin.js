import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.username || !formData.password) {
      setStatus({ type: 'error', message: 'Нэвтрэх нэр болон нууц үгийг бөглөнө үү.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store admin session (in production, use JWT token)
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', data.username || 'admin');
      
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Нэвтрэхэд алдаа гарлаа. Нэвтрэх нэр, нууц үгээ шалгана уу.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-login-card">
        <div className="admin-logo-circle">Δ</div>
        <h1 className="admin-title">Админ Панел</h1>
        <p className="admin-subtitle">Дельтасофт дотоод системд нэвтрэх</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="username">Нэвтрэх нэр</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="admin@deltasoft.mn"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {status.message && (
            <div className={`admin-status ${status.type}`}>{status.message}</div>
          )}

          <button type="submit" className="admin-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="admin-helper-text">
          Зөвхөн дотоод ажилчид ашиглана. Хэрэв нэвтрэх боломжгүй бол системийн
          админтай холбогдоно уу.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;


