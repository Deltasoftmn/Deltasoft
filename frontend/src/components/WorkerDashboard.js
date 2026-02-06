import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearStrapiAuth, getStrapiUser, authFetch, apiUrl } from '../api';
import './AdminDashboard.css';
import './WorkerDashboard.css';

const WORKER_POSTS_STORAGE_KEY = 'worker_job_solutions';
const MEDLEGIINSANS_API = '/api/medlegiinsans';
const CARD_DESCRIPTION_MAX_LENGTH = 120;

/** Extract plain text from Strapi rich text (Description blocks). */
function descriptionToText(desc) {
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) => (block.children || []).map((c) => c.text || '').join(''))
      .join('\n');
  }
  return '';
}

/** Get image URL from zurag array (first image). */
function getZuragUrl(zurag, apiUrlFn) {
  if (!Array.isArray(zurag) || zurag.length === 0) return null;
  const first = zurag[0];
  const url = first.url || first.formats?.medium?.url || first.formats?.small?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : apiUrlFn(url);
}

function getFirstMedia(media) {
  if (!media) return null;
  if (Array.isArray(media)) return media[0] || null;
  if (Array.isArray(media.data)) {
    const first = media.data[0];
    if (!first) return null;
    return first?.attributes ? { id: first.id, ...first.attributes } : first;
  }
  if (media.data) {
    const d = media.data;
    return d?.attributes ? { id: d.id, ...d.attributes } : d;
  }
  return media;
}

function getMediaUrl(media, apiUrlFn) {
  const first = getFirstMedia(media);
  if (!first) return null;
  const url = first.url || first.formats?.medium?.url || first.formats?.small?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : apiUrlFn(url);
}

function getMediaName(media) {
  const first = getFirstMedia(media);
  return first?.name || first?.filename || '';
}

function loadPostsFromStorage() {
  try {
    const raw = localStorage.getItem(WORKER_POSTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePostsToStorage(posts) {
  try {
    localStorage.setItem(WORKER_POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Could not save posts to storage', e);
  }
}

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const user = getStrapiUser();
  const displayName = user?.username || user?.email || 'Ажилтан';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null); // null = all, string = that worker's name
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState(null); // post object when viewing full post
  const [newPost, setNewPost] = useState({ title: '', asuudal: '', link: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [attachFile, setAttachFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    const res = await authFetch(apiUrl('/api/upload'), {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      if (res.status === 403) throw new Error('Зургийн эрх байхгүй. Strapi дээр Upload эрх идэвхжүүлнэ үү.');
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Зураг илгээхэд алдаа (${res.status}).`);
    }
    const json = await res.json().catch(() => ({}));
    const raw = json.data ?? json;
    const first = Array.isArray(raw) ? raw[0] : raw;
    return first?.id != null ? Number(first.id) : null;
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    const res = await authFetch(apiUrl('/api/upload'), {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      if (res.status === 403) throw new Error('Файлын эрх байхгүй. Strapi дээр Upload эрх идэвхжүүлнэ үү.');
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Файл илгээхэд алдаа (${res.status}).`);
    }
    const json = await res.json().catch(() => ({}));
    const raw = json.data ?? json;
    const first = Array.isArray(raw) ? raw[0] : raw;
    return first?.id != null ? Number(first.id) : null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleAttachFileChange = (e) => {
    const file = e.target.files?.[0];
    setAttachFile(file || null);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = apiUrl(`${MEDLEGIINSANS_API}?populate=*&sort=createdAt:desc`);
      const res = await authFetch(url);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        const list = Array.isArray(data) ? data : (data ? [data] : []);
        const mapped = list.map((p) => {
          const descText = descriptionToText(p.Description);
          const content = descText || p.Asuudal || '';
          const rawLink = p.Link ?? p.link;
          const link = typeof rawLink === 'string' ? rawLink.trim() : '';
          return {
            id: p.id ?? p.documentId,
            title: p.Title ?? '',
            content,
            asuudal: p.Asuudal ?? '',
            authorName: p.name ?? displayName,
            createdAt: p.createdAt ?? p.publishedAt ?? new Date().toISOString(),
            imageUrl: getZuragUrl(p.zurag, apiUrl),
            link,
            fileUrl: getMediaUrl(p.File ?? p.file, apiUrl),
            fileName: getMediaName(p.File ?? p.file),
          };
        });
        setPosts(mapped);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Medlegiinsans API not available', e);
    }
    setPosts(loadPostsFromStorage());
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, []);

  const workersList = useMemo(() => {
    const names = [...new Set(posts.map((p) => p.authorName).filter(Boolean))].sort((a, b) =>
      (a || '').localeCompare(b || '')
    );
    return names;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let list = posts;
    if (selectedWorker) {
      list = list.filter((p) => (p.authorName || '') === selectedWorker);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.content || '').toLowerCase().includes(q) ||
        (p.asuudal || '').toLowerCase().includes(q)
    );
  }, [posts, searchQuery, selectedWorker]);

  const handleLogout = () => {
    clearStrapiAuth();
    navigate('/admin', { replace: true });
  };

  const handleAddPostSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });
    if (!newPost.title?.trim() && !newPost.content?.trim()) {
      setSubmitStatus({ type: 'error', message: 'Гарчиг эсвэл агуулга оруулна уу.' });
      return;
    }
    setSubmitting(true);
    const title = (newPost.title || '').trim() || 'Гарчиггүй';
    const asuudal = (newPost.asuudal || '').trim() || '';
    const link = (newPost.link || '').trim() || '';
    const contentText = (newPost.content || '').trim() || '';
    const descriptionBlocks = [{ type: 'paragraph', children: [{ type: 'text', text: contentText }] }];
    let zuragId = null;
    if (imageFile) {
      try {
        zuragId = await uploadImage(imageFile);
      } catch (err) {
        setSubmitStatus({ type: 'error', message: err.message || 'Зураг илгээхэд алдаа.' });
        setSubmitting(false);
        return;
      }
    }
    let fileId = null;
    if (attachFile) {
      try {
        fileId = await uploadFile(attachFile);
      } catch (err) {
        setSubmitStatus({ type: 'error', message: err.message || 'Файл илгээхэд алдаа.' });
        setSubmitting(false);
        return;
      }
    }
    const payload = {
      data: {
        Title: title,
        Asuudal: asuudal || title,
        Description: descriptionBlocks,
        name: displayName,
      },
    };
    if (zuragId != null) payload.data.zurag = [zuragId];
    if (fileId != null) payload.data.File = [fileId];
    if (link) payload.data.Link = link;
    try {
      const res = await authFetch(apiUrl(MEDLEGIINSANS_API), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitStatus({ type: 'success', message: 'Шийдэл амжилттай нэмэгдлээ.' });
        setNewPost({ title: '', asuudal: '', link: '', content: '' });
        setImageFile(null);
        setImagePreview(null);
        setAttachFile(null);
        setAddPostOpen(false);
        fetchPosts();
      } else {
        const err = await res.json().catch(() => ({}));
        if (res.status === 404 || res.status === 403) {
          const fallbackPost = {
            id: `local-${Date.now()}`,
            title,
            content: contentText,
            asuudal,
            authorName: displayName,
            createdAt: new Date().toISOString(),
            imageUrl: imagePreview || null,
            link,
            fileUrl: null,
            fileName: attachFile?.name || '',
          };
          const next = [fallbackPost, ...posts];
          setPosts(next);
          savePostsToStorage(next);
          setSubmitStatus({ type: 'success', message: 'Шийдэл нэмэгдлээ.' });
          setNewPost({ title: '', asuudal: '', link: '', content: '' });
          setImageFile(null);
          setImagePreview(null);
          setAttachFile(null);
          setAddPostOpen(false);
        } else {
          setSubmitStatus({ type: 'error', message: err.error?.message || 'Шийдэл нэмэхэд алдаа гарлаа.' });
        }
      }
    } catch (err) {
      const fallbackPost = {
        id: `local-${Date.now()}`,
        title,
        content: contentText,
        asuudal,
        authorName: displayName,
        createdAt: new Date().toISOString(),
        imageUrl: imagePreview || null,
        link,
        fileUrl: null,
        fileName: attachFile?.name || '',
      };
      const next = [fallbackPost, ...posts];
      setPosts(next);
      savePostsToStorage(next);
      setSubmitStatus({ type: 'success', message: 'Шийдэл нэмэгдлээ.' });
      setNewPost({ title: '', asuudal: '', link: '', content: '' });
      setImageFile(null);
      setImagePreview(null);
      setAttachFile(null);
      setAddPostOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-dashboard worker-dashboard">
      <aside className="admin-sidebar worker-sidebar-slim">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">Δ</span>
          <h2>Ажилтан</h2>
        </div>
        <nav className="worker-sidebar-workers" aria-label="Ажилчдын жагсаалт">
          <button
            type="button"
            className={'worker-sidebar-worker-btn' + (selectedWorker === null ? ' active' : '')}
            onClick={() => setSelectedWorker(null)}
          >
            Бүх шийдлүүд
          </button>
          {workersList.map((name) => (
            <button
              key={name}
              type="button"
              className={'worker-sidebar-worker-btn' + (selectedWorker === name ? ' active' : '')}
              onClick={() => setSelectedWorker(name)}
            >
              {name}
            </button>
          ))}
        </nav>
        <div className="worker-sidebar-user">
          <span className="worker-user-label">{displayName}</span>
        </div>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          Гарах
        </button>
      </aside>
      <main className="admin-main worker-feed-main">
        <div className="worker-feed-header">
          <h1 className="worker-feed-title">
            {selectedWorker ? `${selectedWorker}-ийн шийдлүүд` : 'Ажлын шийдлүүд'}
          </h1>
          <p className="worker-feed-desc">
            {selectedWorker
              ? 'Энэ ажилтны нийтлсэн шийдлүүд.'
              : 'Шийдлээ хуваалцаж, бусдын шийдлүүдийг хайна уу.'}
          </p>
          <div className="worker-feed-actions">
            <button
              type="button"
              className="worker-add-post-btn"
              onClick={() => setAddPostOpen(true)}
            >
              + Шийдэл нэмэх
            </button>
            <div className="worker-search-wrap">
              <input
                type="search"
                className="worker-search-input"
                placeholder="Шийдл хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search solutions"
              />
            </div>
          </div>
        </div>

        <div className="worker-feed">
          {loading ? (
            <p className="worker-feed-loading">Ачааллаж байна...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="worker-feed-empty">
              {searchQuery.trim() ? 'Хайлтад тохирох шийдлүүд олдсонгүй.' : 'Одоогоор шийдлүүд байхгүй. "Шийдэл нэмэх" дарж эхлээрэй.'}
            </p>
          ) : (
            <ul className="worker-post-list">
              {filteredPosts.map((post) => {
                const content = post.content || '';
                const shortContent = content.length > CARD_DESCRIPTION_MAX_LENGTH
                  ? content.slice(0, CARD_DESCRIPTION_MAX_LENGTH).trim() + '...'
                  : content;
                return (
                  <li
                    key={post.id}
                    className="worker-post-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setViewingPost(post)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewingPost(post); } }}
                    aria-label="Шийдлийг дэлгэрэнгүй харах"
                  >
                    <div className="worker-post-header">
                      <span className="worker-post-author">{post.authorName}</span>
                      <span className="worker-post-date">{formatDate(post.createdAt)}</span>
                    </div>
                    {post.title && <h3 className="worker-post-title">{post.title}</h3>}
                  {post.asuudal && <p className="worker-post-asuudal">{post.asuudal}</p>}
                  {(post.link || post.fileUrl) && (
                    <div className="worker-post-attachments worker-post-attachments-inline">
                      {post.link && <span className="worker-post-attachment-badge">Link</span>}
                      {post.fileUrl && <span className="worker-post-attachment-badge">File</span>}
                    </div>
                  )}
                    {post.imageUrl && (
                      <div className="worker-post-image-wrap worker-post-image-wrap-thumb">
                        <img src={post.imageUrl} alt="" className="worker-post-image" />
                      </div>
                    )}
                    <div className="worker-post-content worker-post-content-preview">{shortContent}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {addPostOpen && (
        <div className="worker-modal-backdrop" onClick={() => setAddPostOpen(false)}>
          <div className="worker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="worker-modal-header">
              <h2>Шинэ шийдэл</h2>
              <button type="button" className="worker-modal-close" onClick={() => setAddPostOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <form className="worker-post-form" onSubmit={handleAddPostSubmit}>
              <div className="worker-form-row-two">
                <div className="worker-form-group">
                  <label htmlFor="post-title">Title</label>
                  <input
                    id="post-title"
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Гарчиг"
                  />
                </div>
                <div className="worker-form-group">
                  <label htmlFor="post-asuudal">Asuudal</label>
                  <input
                    id="post-asuudal"
                    type="text"
                    value={newPost.asuudal}
                    onChange={(e) => setNewPost((p) => ({ ...p, asuudal: e.target.value }))}
                    placeholder="Асуудал / сэдэв"
                  />
                </div>
              </div>
              <div className="worker-form-row-two">
                <div className="worker-form-group">
                  <label>File</label>
                  <div className="worker-upload-area">
                    <input
                      type="file"
                      id="post-file"
                      onChange={handleAttachFileChange}
                      className="worker-upload-input"
                    />
                    <label htmlFor="post-file" className="worker-upload-label worker-upload-label-file">
                      {attachFile ? (
                        <span className="worker-upload-file-wrap">
                          <span className="worker-upload-file-name">{attachFile.name}</span>
                          <span className="worker-upload-change">Файл солих</span>
                        </span>
                      ) : (
                        <>
                          <span className="worker-upload-icon">+</span>
                          <span>Дарж файл оруулна уу эсвэл чирж тавина</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div className="worker-form-group">
                  <label>zurag (Зураг)</label>
                  <div className="worker-upload-area">
                    <input
                      type="file"
                      id="post-zurag"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="worker-upload-input"
                    />
                    <label htmlFor="post-zurag" className="worker-upload-label">
                      {imagePreview ? (
                        <span className="worker-upload-preview-wrap">
                          <img src={imagePreview} alt="" className="worker-upload-preview" />
                          <span className="worker-upload-change">Зураг солих</span>
                        </span>
                      ) : (
                        <>
                          <span className="worker-upload-icon">+</span>
                          <span>Дарж зураг оруулна уу эсвэл чирж тавина</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="worker-form-group">
                <label htmlFor="post-link">Link</label>
                <input
                  id="post-link"
                  type="url"
                  value={newPost.link}
                  onChange={(e) => setNewPost((p) => ({ ...p, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="worker-form-group">
                <label htmlFor="post-content">Description *</label>
                <textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Шийдлээ, тайлбараа бичнэ үү..."
                  rows={5}
                  required
                />
              </div>
              <p className="worker-form-hint">Шийдэл нь одоогийн нэвтэрсэн хэрэглэгчийн нэрээр автоматаар бүртгэгдэнэ.</p>
              {submitStatus.message && (
                <div className={`worker-report-status ${submitStatus.type}`}>{submitStatus.message}</div>
              )}
              <div className="worker-modal-actions">
                <button type="button" className="worker-btn-secondary" onClick={() => setAddPostOpen(false)}>
                  Болих
                </button>
                <button type="submit" className="worker-report-submit" disabled={submitting}>
                  {submitting ? 'Илгээж байна...' : 'Нийтлэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingPost && (
        <div className="worker-modal-backdrop" onClick={() => setViewingPost(null)}>
          <div className="worker-modal worker-modal-view" onClick={(e) => e.stopPropagation()}>
            <div className="worker-modal-header">
              <h2>Шийдлийн дэлгэрэнгүй</h2>
              <button type="button" className="worker-modal-close" onClick={() => setViewingPost(null)} aria-label="Хаах">
                ✕
              </button>
            </div>
            <div className="worker-view-body">
              <div className="worker-post-header">
                <span className="worker-post-author">{viewingPost.authorName}</span>
                <span className="worker-post-date">{formatDate(viewingPost.createdAt)}</span>
              </div>
              {viewingPost.title && <h3 className="worker-post-title">{viewingPost.title}</h3>}
              {viewingPost.asuudal && <p className="worker-post-asuudal">{viewingPost.asuudal}</p>}
              {viewingPost.imageUrl && (
                <div className="worker-post-image-wrap worker-post-image-wrap-full">
                  <img src={viewingPost.imageUrl} alt="" className="worker-post-image" />
                </div>
              )}
              {(viewingPost.link || viewingPost.fileUrl) && (
                <div className="worker-post-attachments">
                  {viewingPost.link && (
                    <a
                      className="worker-post-attachment"
                      href={viewingPost.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link нээх
                    </a>
                  )}
                  {viewingPost.fileUrl && (
                    <a
                      className="worker-post-attachment"
                      href={viewingPost.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {viewingPost.fileName ? `Файл: ${viewingPost.fileName}` : 'Файл татах'}
                    </a>
                  )}
                </div>
              )}
              <div className="worker-post-content worker-post-content-full">{viewingPost.content || ''}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
