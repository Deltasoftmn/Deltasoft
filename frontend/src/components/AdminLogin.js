import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl, setStrapiAuth, getStrapiJwt } from '../api';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (getStrapiJwt()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Нэвтрэх нэр болон нууц үгийг оруулна уу.');
      return;
    }
    setLoading(true);
    try {
      const url = apiUrl('/api/auth/local');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        if (res.status === 500 || text.toLowerCase().includes('proxy') || text.toLowerCase().includes('error')) {
          setError(
            'Серверт холбогдсонгүй. Локал дээр ажиллуулж байгаа бол Strapi (https://admin.deltasoft.website) ашиглахын тулд frontend/.env файлд REACT_APP_STRAPI_URL=https://admin.deltasoft.website гэж тохируулна уу. Дараа нь npm start дахин эхлүүлнэ.'
          );
          return;
        }
        throw new Error('Сервер буруу хариу буцаалсан.');
      }
      if (!res.ok) {
        throw new Error(data.error?.message || data.error?.details?.errors?.[0]?.message || 'Нэвтрэхэд алдаа гарлаа.');
      }
      setStrapiAuth(data.jwt, data.user);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Нэвтрэхэд алдаа гарлаа. Шалгаад дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">Δ</div>
        <h1>Админ нэвтрэх</h1>
        <p className="admin-login-subtitle">Сайтын удирдлага – мэдээ, холбоо барих</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-identifier">И-мэйл эсвэл нэр</label>
            <input
              id="admin-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@deltasoft.mn"
              autoComplete="username"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="admin-password">Нууц үг</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="admin-login-hint">
          Strapi-д бүртгэлтэй хэрэглэгчийн нэр/и-мэйл болон нууц үгээ оруулна уу. Өгөгдөл Strapi-д хадгалагдана.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
