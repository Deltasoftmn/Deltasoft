import React, { useState, useEffect } from 'react';
import { apiUrl, authFetch } from '../../api';
import './ContactList.css';

function richTextToPlain(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((c) => (c && c.text) || '').join('');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

function normalizeHolboo(d) {
  if (!d) return null;
  const attrs = d.attributes || {};
  const flat = typeof d.ner !== 'undefined' || typeof d.email !== 'undefined';
  const ner = flat ? d.ner : attrs.ner;
  const email = flat ? d.email : attrs.email;
  const utas = flat ? d.utas : attrs.utas;
  const garchig = flat ? d.garchig : attrs.garchig;
  const medeelelRaw = flat ? d.medeelel : attrs.medeelel;
  const message = richTextToPlain(medeelelRaw);
  return {
    id: d.id,
    documentId: d.documentId,
    name: ner || '',
    email: email || '',
    phone: utas || '',
    subject: garchig || '',
    message,
    createdAt: flat ? d.createdAt : attrs.createdAt,
  };
}

const HolbooBarihList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingItem, setViewingItem] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(apiUrl('/api/holboo-barihs?populate=*&sort=createdAt:desc'));
      if (!res.ok) throw new Error('Холбоо барих жагсаалт татахад алдаа гарлаа.');
      const json = await res.json();
      const raw = json.data;
      setList(Array.isArray(raw) ? raw.map(normalizeHolboo).filter(Boolean) : []);
    } catch (e) {
      setError(e.message || 'Алдаа гарлаа.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (item, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Энэ холбоо барих мессежийг устгах уу?')) return;
    const docId = item.documentId ?? item.id;
    try {
      const res = await authFetch(apiUrl(`/api/holboo-barihs/${docId}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгахад алдаа гарлаа.');
      setList((prev) => prev.filter((c) => (c.documentId ?? c.id) !== docId));
      setViewingItem(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="contact-list-admin">
      <div className="contact-list-header">
        <h1>Холбоо барих</h1>
      </div>
      {error && <div className="contact-list-error">{error}</div>}

      {loading ? (
        <p className="contact-list-loading">Ачааллаж байна...</p>
      ) : list.length === 0 ? (
        <p className="contact-list-empty">Холбоо барих мессеж байхгүй байна.</p>
      ) : (
        <div className="contact-stats">
          <span>Нийт: {list.length}</span>
        </div>
      )}

      {!loading && list.length > 0 && (
        <ul className="contact-list">
          {list.map((item) => (
            <li
              key={item.documentId || item.id}
              className="contact-item contact-item-clickable"
              role="button"
              tabIndex={0}
              onClick={() => setViewingItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setViewingItem(item);
                }
              }}
              aria-label="Дэлгэрэнгүй харах"
            >
              <div className="contact-item-header">
                <div>
                  <strong>{item.name}</strong>
                  <span className="contact-email">{item.email}</span>
                  {item.phone && <span className="contact-phone">{item.phone}</span>}
                  {item.subject && <span className="contact-service">Гарчиг: {item.subject}</span>}
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
                  <button type="button" className="btn-delete-small" onClick={(e) => handleDelete(item, e)}>
                    Устгах
                  </button>
                </div>
              </div>
              {item.message && <div className="contact-message">{item.message}</div>}
            </li>
          ))}
        </ul>
      )}

      {viewingItem && (
        <div className="holboo-detail-backdrop" onClick={() => setViewingItem(null)}>
          <div className="holboo-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="holboo-detail-header">
              <h2>Холбоо барих – дэлгэрэнгүй</h2>
              <button type="button" className="holboo-detail-close" onClick={() => setViewingItem(null)} aria-label="Хаах">
                Хаах
              </button>
            </div>
            <div className="holboo-detail-body">
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Нэр</span>
                <span className="holboo-detail-value">{viewingItem.name}</span>
              </div>
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">И-мэйл</span>
                <span className="holboo-detail-value">{viewingItem.email}</span>
              </div>
              {viewingItem.phone && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Утас</span>
                  <span className="holboo-detail-value">{viewingItem.phone}</span>
                </div>
              )}
              {viewingItem.subject && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Гарчиг</span>
                  <span className="holboo-detail-value">{viewingItem.subject}</span>
                </div>
              )}
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Огноо</span>
                <span className="holboo-detail-value">{formatDate(viewingItem.createdAt)}</span>
              </div>
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Мэдээлэл</span>
                <div className="holboo-detail-value holboo-detail-message">
                  {viewingItem.message || '—'}
                </div>
              </div>
              <div className="holboo-detail-actions">
                <button type="button" className="holboo-detail-close" onClick={() => setViewingItem(null)}>
                  Хаах
                </button>
                <button type="button" className="btn-delete-small" onClick={(e) => handleDelete(viewingItem, e)}>
                  Устгах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolbooBarihList;
