import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl, setStrapiAuth, getStrapiJwt } from '../api';
import './AdminLogin.css';

const parseAuthResponse = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    if (res.status === 500 || text.toLowerCase().includes('proxy') || text.toLowerCase().includes('error')) {
      return { serverError: true };
    }
    throw new Error('Сервер буруу хариу буцаалсан.');
  }
};

const LOGIN_MODES = { admin: 'admin', worker: 'worker' };

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(LOGIN_MODES.admin);
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
      const res = await fetch(apiUrl('/api/auth/local'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await parseAuthResponse(res);
      if (data.serverError) {
        setError(
          'Серверт холбогдсонгүй. Локал дээр ажиллуулж байгаа бол Strapi (https://admin.deltasoft.website) ашиглахын тулд frontend/.env файлд REACT_APP_STRAPI_URL=https://admin.deltasoft.website гэж тохируулна уу. Дараа нь npm start дахин эхлүүлнэ.'
        );
        return;
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

  const isAdmin = mode === LOGIN_MODES.admin;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">Δ</div>

        <div className="admin-login-switch">
          <button
            type="button"
            className={isAdmin ? 'active' : ''}
            onClick={() => { setMode(LOGIN_MODES.admin); setError(''); }}
          >
            Админ
          </button>
          <button
            type="button"
            className={!isAdmin ? 'active' : ''}
            onClick={() => { setMode(LOGIN_MODES.worker); setError(''); }}
          >
            Ажилтан
          </button>
        </div>

        <h1>{isAdmin ? 'Админ нэвтрэх' : 'Ажилтан нэвтрэх'}</h1>
        <p className="admin-login-subtitle">
          {isAdmin
            ? 'Сайтын удирдлага – мэдээ, холбоо барих'
            : 'Strapi-д бүртгэлтэй ажилтны нэр/и-мэйл, нууц үгээр нэвтрэнэ'}
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="login-identifier">И-мэйл эсвэл нэр</label>
            <input
              id="login-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isAdmin ? 'admin@deltasoft.mn' : 'worker@deltasoft.mn'}
              autoComplete="username"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="login-password">Нууц үг</label>
            <input
              id="login-password"
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
          {isAdmin
            ? 'Strapi-д бүртгэлтэй хэрэглэгчийн нэр/и-мэйл болон нууц үгээ оруулна уу. Өгөгдөл Strapi-д хадгалагдана.'
            : 'Ажилтны бүртгэл Strapi-д хадгалагдана. Нэвтэрсний дараа удирдлагын самбар руу шилжинэ.'}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
