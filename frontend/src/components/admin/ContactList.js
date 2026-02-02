import React, { useState, useEffect } from 'react';
import { apiUrl, authFetch } from '../../api';
import './ContactList.css';

function normalizeContact(d) {
  if (!d) return null;
  const attrs = d.attributes || {};
  return {
    id: d.id,
    name: attrs.name || '',
    email: attrs.email || '',
    phone: attrs.phone || '',
    message: attrs.message || '',
    status: attrs.status || 'new',
    createdAt: attrs.createdAt,
  };
}

const statusLabel = { new: 'Шинэ', read: 'Уншсан', replied: 'Хариулсан' };

const ContactList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(apiUrl('/api/contacts?sort=createdAt:desc'));
      if (!res.ok) throw new Error('Холбоо барих жагсаалт татахад алдаа гарлаа.');
      const json = await res.json();
      const raw = json.data;
      setList(Array.isArray(raw) ? raw.map(normalizeContact).filter(Boolean) : []);
    } catch (e) {
      setError(e.message || 'Алдаа гарлаа.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await authFetch(apiUrl(`/api/contacts/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status } }),
      });
      if (!res.ok) throw new Error('Төлөв солиход алдаа гарлаа.');
      setList((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Энэ холбоо барихыг устгах уу?')) return;
    try {
      const res = await authFetch(apiUrl(`/api/contacts/${id}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгахад алдаа гарлаа.');
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="contact-list-admin">
      <div className="contact-list-header">
        <h1>Холбоо барих / Үнийн санал</h1>
      </div>
      {error && <div className="contact-list-error">{error}</div>}

      {loading ? (
        <p className="contact-list-loading">Ачааллаж байна...</p>
      ) : list.length === 0 ? (
        <p className="contact-list-empty">Холбоо барих, үнийн санал байхгүй байна.</p>
      ) : (
        <div className="contact-stats">
          <span>Нийт: {list.length}</span>
          <span>Шинэ: {list.filter((c) => c.status === 'new').length}</span>
        </div>
      )}

      {!loading && list.length > 0 && (
        <ul className="contact-list">
          {list.map((item) => (
            <li key={item.id} className="contact-item">
              <div className="contact-item-header">
                <div>
                  <strong>{item.name}</strong>
                  <span className="contact-email">{item.email}</span>
                  {item.phone && <span className="contact-phone">{item.phone}</span>}
                </div>
                <div className="contact-meta">
                  <span className="contact-date">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="contact-status-select"
                  >
                    <option value="new">{statusLabel.new}</option>
                    <option value="read">{statusLabel.read}</option>
                    <option value="replied">{statusLabel.replied}</option>
                  </select>
                  <button type="button" className="btn-delete-small" onClick={() => handleDelete(item.id)}>
                    Устгах
                  </button>
                </div>
              </div>
              <div className="contact-message">{item.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
