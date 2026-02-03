import React, { useState, useEffect } from 'react';
import { apiUrl, authFetch } from '../../api';
import './ContactList.css';

/** Extract plain text from Strapi rich-text (blocks) field */
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

function normalizeQuote(d) {
  if (!d) return null;
  const attrs = d.attributes || {};
  const flat = typeof d.Ner !== 'undefined' || typeof d.email !== 'undefined';
  const ner = flat ? d.Ner : attrs.Ner;
  const email = flat ? d.email : attrs.email;
  const utas = flat ? d.Utas : attrs.Utas;
  const uilchilgee = flat ? d.Uilchilgee : attrs.Uilchilgee;
  const tailbarRaw = flat ? d.tailbar : attrs.tailbar;
  const tailbar = richTextToPlain(tailbarRaw);
  return {
    id: d.id,
    documentId: d.documentId,
    name: ner || '',
    email: email || '',
    phone: utas || '',
    service: uilchilgee || '',
    message: tailbar,
    createdAt: flat ? d.createdAt : attrs.createdAt,
  };
}

const ContactList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(apiUrl('/api/uniin-sanals?populate=*&sort=createdAt:desc'));
      if (!res.ok) throw new Error('Үнийн санал жагсаалт татахад алдаа гарлаа.');
      const json = await res.json();
      const raw = json.data;
      setList(Array.isArray(raw) ? raw.map(normalizeQuote).filter(Boolean) : []);
    } catch (e) {
      setError(e.message || 'Алдаа гарлаа.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm('Энэ үнийн саналыг устгах уу?')) return;
    const docId = item.documentId ?? item.id;
    try {
      const res = await authFetch(apiUrl(`/api/uniin-sanals/${docId}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгахад алдаа гарлаа.');
      setList((prev) => prev.filter((c) => (c.documentId ?? c.id) !== docId));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="contact-list-admin">
      <div className="contact-list-header">
        <h1>Үнийн санал</h1>
      </div>
      {error && <div className="contact-list-error">{error}</div>}

      {loading ? (
        <p className="contact-list-loading">Ачааллаж байна...</p>
      ) : list.length === 0 ? (
        <p className="contact-list-empty">Үнийн санал байхгүй байна.</p>
      ) : (
        <div className="contact-stats">
          <span>Нийт: {list.length}</span>
        </div>
      )}

      {!loading && list.length > 0 && (
        <ul className="contact-list">
          {list.map((item) => (
            <li key={item.documentId || item.id} className="contact-item">
              <div className="contact-item-header">
                <div>
                  <strong>{item.name}</strong>
                  <span className="contact-email">{item.email}</span>
                  {item.phone && <span className="contact-phone">{item.phone}</span>}
                  {item.service && <span className="contact-service">Үйлчилгээ: {item.service}</span>}
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
                  <button type="button" className="btn-delete-small" onClick={() => handleDelete(item)}>
                    Устгах
                  </button>
                </div>
              </div>
              {item.message && <div className="contact-message">{item.message}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
