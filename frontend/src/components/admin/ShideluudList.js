import React, { useState, useEffect, useMemo } from 'react';
import { apiUrl, authFetch } from '../../api';
import './ContactList.css';

const MEDLEGIINSANS_API = '/api/medlegiinsans';

function descriptionToText(desc) {
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) => (block.children || []).map((c) => c.text || '').join(''))
      .join('\n');
  }
  return '';
}

function getZuragUrl(zurag, apiUrlFn) {
  if (!zurag) return null;
  const arr = Array.isArray(zurag) ? zurag : (zurag.data ? (Array.isArray(zurag.data) ? zurag.data : [zurag.data]) : []);
  if (arr.length === 0) return null;
  const first = arr[0];
  const attrs = first?.attributes || first;
  const url = attrs.url || first.url || attrs.formats?.medium?.url || first.formats?.medium?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : apiUrlFn(url);
}

function getFirstMedia(media, apiUrlFn) {
  if (!media) return { url: null, name: '' };
  const data = media.data;
  const arr = Array.isArray(data) ? data : (data ? [data] : []);
  const first = arr[0];
  if (!first) return { url: null, name: '' };
  const attrs = first?.attributes || first;
  const url = attrs.url || first.url || attrs.formats?.medium?.url;
  const name = attrs.name || attrs.filename || first.name || '';
  return {
    url: url ? (url.startsWith('http') ? url : apiUrlFn(url)) : null,
    name,
  };
}

function normalizeItem(p) {
  if (!p) return null;
  const attrs = p.attributes || {};
  const flat = typeof p.Title !== 'undefined' || typeof p.Description !== 'undefined';
  const title = flat ? (p.Title ?? '') : (attrs.Title ?? attrs.title ?? '');
  const descRaw = flat ? p.Description : (attrs.Description ?? attrs.description);
  const content = descriptionToText(descRaw) || (flat ? p.Asuudal : attrs.Asuudal ?? attrs.asuudal) || '';
  const asuudal = flat ? (p.Asuudal ?? '') : (attrs.Asuudal ?? attrs.asuudal ?? '');
  const authorName = flat ? (p.name ?? '') : (attrs.name ?? '');
  const rawLink = flat ? (p.Link ?? p.link) : (attrs.Link ?? attrs.link);
  const link = typeof rawLink === 'string' ? rawLink.trim() : '';
  const createdAt = flat ? (p.createdAt ?? p.publishedAt) : (attrs.createdAt ?? attrs.publishedAt);
  const documentId = flat ? p.documentId : (p.documentId ?? attrs.documentId);
  const id = p.id ?? documentId;
  const zurag = flat ? p.zurag : (attrs.zurag ?? p.zurag);
  const fileRef = flat ? (p.File ?? p.file) : (attrs.File ?? attrs.file);
  const fileInfo = getFirstMedia(fileRef, apiUrl);
  const imageUrl = getZuragUrl(zurag, apiUrl);
  return {
    id,
    documentId,
    title,
    content,
    asuudal,
    authorName,
    link,
    createdAt,
    imageUrl,
    fileUrl: fileInfo.url,
    fileName: fileInfo.name,
  };
}

const ShideluudList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingItem, setViewingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(apiUrl(`${MEDLEGIINSANS_API}?populate=*&sort=createdAt:desc`));
      if (!res.ok) throw new Error('Шийдлүүдийг татахад алдаа гарлаа.');
      const json = await res.json();
      const data = json.data;
      const raw = Array.isArray(data) ? data : (data ? [data] : []);
      setList(raw.map(normalizeItem).filter(Boolean));
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
    if (!window.confirm('Энэ шийдлийг устгах уу?')) return;
    const docId = item.documentId ?? item.id;
    try {
      const res = await authFetch(apiUrl(`${MEDLEGIINSANS_API}/${docId}`), { method: 'DELETE' });
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (item) =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.authorName || '').toLowerCase().includes(q) ||
        (item.asuudal || '').toLowerCase().includes(q) ||
        (item.content || '').toLowerCase().includes(q)
    );
  }, [list, searchQuery]);

  return (
    <div className="contact-list-admin">
      <div className="contact-list-header">
        <h1>Шийдлүүд</h1>
      </div>
      {error && <div className="contact-list-error">{error}</div>}

      {loading ? (
        <p className="contact-list-loading">Ачааллаж байна...</p>
      ) : list.length === 0 ? (
        <p className="contact-list-empty">Шийдл байхгүй байна.</p>
      ) : (
        <>
          <div className="contact-stats">
            <span>Нийт: {list.length}</span>
            {searchQuery.trim() && <span>Хайлтад: {filteredList.length}</span>}
          </div>
          <div className="shideluud-search-wrap">
            <input
              type="search"
              className="shideluud-search-input"
              placeholder="Шийдл хайх (гарчиг, зохиогч, асуудал, тайлбар)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Шийдл хайх"
            />
          </div>
        </>
      )}

      {!loading && list.length > 0 && filteredList.length === 0 && (
        <p className="contact-list-empty">Хайлтад тохирох шийдл олдсонгүй.</p>
      )}

      {!loading && filteredList.length > 0 && (
        <ul className="contact-list">
          {filteredList.map((item) => (
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
                  <strong>{item.title || 'Гарчиггүй'}</strong>
                  {item.authorName && <span className="contact-email">{item.authorName}</span>}
                  {item.asuudal && <span className="contact-service">Асуудал: {item.asuudal}</span>}
                </div>
                <div className="contact-meta">
                  <span className="contact-date">{formatDate(item.createdAt)}</span>
                  <button type="button" className="btn-delete-small" onClick={(e) => handleDelete(item, e)}>
                    Устгах
                  </button>
                </div>
              </div>
              {item.content && (
                <div className="contact-message">
                  {item.content.length > 200 ? `${item.content.slice(0, 200)}…` : item.content}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {viewingItem && (
        <div className="holboo-detail-backdrop" onClick={() => setViewingItem(null)}>
          <div className="holboo-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="holboo-detail-header">
              <h2>Шийдлийн дэлгэрэнгүй</h2>
              <button type="button" className="holboo-detail-close" onClick={() => setViewingItem(null)} aria-label="Хаах">
                Хаах
              </button>
            </div>
            <div className="holboo-detail-body">
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Гарчиг</span>
                <span className="holboo-detail-value">{viewingItem.title || '—'}</span>
              </div>
              {viewingItem.authorName && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Зохиогч</span>
                  <span className="holboo-detail-value">{viewingItem.authorName}</span>
                </div>
              )}
              {viewingItem.asuudal && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Асуудал</span>
                  <span className="holboo-detail-value">{viewingItem.asuudal}</span>
                </div>
              )}
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Огноо</span>
                <span className="holboo-detail-value">{formatDate(viewingItem.createdAt)}</span>
              </div>
              {viewingItem.imageUrl && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Зураг</span>
                  <div className="holboo-detail-value">
                    <img src={viewingItem.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} />
                  </div>
                </div>
              )}
              {(viewingItem.link || viewingItem.fileUrl) && (
                <div className="holboo-detail-row">
                  <span className="holboo-detail-label">Холбоос / Файл</span>
                  <div className="holboo-detail-value">
                    {viewingItem.link && (
                      <a href={viewingItem.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-green)', marginRight: 12 }}>
                        Link нээх
                      </a>
                    )}
                    {viewingItem.fileUrl && (
                      <a href={viewingItem.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-green)' }}>
                        {viewingItem.fileName || 'Файл татах'}
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="holboo-detail-row">
                <span className="holboo-detail-label">Тайлбар</span>
                <div className="holboo-detail-value holboo-detail-message">{viewingItem.content || '—'}</div>
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

export default ShideluudList;
