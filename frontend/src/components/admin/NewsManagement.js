import React, { useState, useEffect } from 'react';
import { apiUrl, authFetch, STRAPI_NEWS_API } from '../../api';
import './NewsManagement.css';

/** Extract plain text from Strapi Description: string or blocks array */
function descriptionToText(desc) {
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) => (block.children || []).map((c) => c.text || '').join(''))
      .join('\n');
  }
  if (desc?.root?.children) {
    return desc.root.children.map((c) => (c.children || []).map((t) => t.text).join('')).join('');
  }
  return '';
}

function normalizeNewsItem(d) {
  if (!d) return null;
  const flat = d.Title != null;
  const title = flat ? (d.Title || '') : (d.attributes?.title || '');
  const body = flat ? d.Description : (d.attributes?.content ?? d.attributes?.description ?? '');
  const content = descriptionToText(body);
  const author = flat ? (d.Author || '') : (d.attributes?.author || '');
  const publishedAt = flat ? d.publishedAt : d.attributes?.publishedAt;
  let imageId = null;
  let imageUrl = null;
  if (flat && Array.isArray(d.Image) && d.Image[0]) {
    imageId = d.Image[0].id;
    const u = d.Image[0].url || d.Image[0].formats?.medium?.url;
    imageUrl = u ? (u.startsWith('http') ? u : apiUrl(u)) : null;
  } else {
    const imageData = d.attributes?.image?.data;
    imageId = imageData?.id;
    const u = imageData?.attributes?.url ?? imageData?.url;
    imageUrl = u ? (u.startsWith('http') ? u : apiUrl(u)) : null;
  }
  const documentId = flat ? d.documentId : d.documentId ?? d.attributes?.documentId;
  return {
    id: d.id,
    documentId: documentId || null,
    title,
    content,
    author,
    publishedAt,
    published: !!publishedAt,
    imageId,
    imageUrl,
  };
}

const NewsManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', author: '', published: false });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ populate: '*', sort: 'createdAt:desc' });
      let res = await authFetch(apiUrl(`/api/${STRAPI_NEWS_API}?${query}`));
      if (res.status === 400) {
        const fallback = new URLSearchParams({ populate: '*' });
        res = await authFetch(apiUrl(`/api/${STRAPI_NEWS_API}?${fallback}`));
      }
      if (!res.ok) throw new Error('Мэдээ татахад алдаа гарлаа.');
      const json = await res.json();
      const raw = json.data;
      setList(Array.isArray(raw) ? raw.map(normalizeNewsItem).filter(Boolean) : []);
    } catch (e) {
      setError(e.message || 'Алдаа гарлаа.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    const res = await authFetch(apiUrl('/api/upload'), {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error(
          'UPLOAD_PERMISSION: Strapi дээр Upload эрх идэвхжүүлнэ үү: Settings → Users & Permissions → Roles → Authenticated → Upload → "upload" сонгоно уу.'
        );
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Зураг илгээхэд алдаа (${res.status}).`);
    }
    const json = await res.json().catch(() => ({}));
    const raw = json.data ?? json;
    const first = Array.isArray(raw) ? raw[0] : raw;
    const id = first?.id != null ? Number(first.id) : null;
    return id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title?.trim() || !form.content?.trim()) {
      setError('Гарчиг болон агуулга заавал байна.');
      return;
    }
    setSubmitLoading(true);
    try {
      let imageIdFromUpload = null;
      if (imageFile) {
        try {
          imageIdFromUpload = await uploadImage(imageFile);
        } catch (uploadErr) {
          const msg = String(uploadErr?.message || '');
          setError(
            msg.includes('UPLOAD_PERMISSION')
              ? 'Зургийн эрх байхгүй. Strapi Admin → Settings → Users & Permissions → Roles → [таны роль] → Upload → "upload" идэвхжүүлнэ үү. Мэдээг зураггүйгээр хадгалж байна.'
              : `Зураг илгээхэд алдаа: ${msg || 'Зураггүйгээр хадгална.'}`
          );
          imageIdFromUpload = null;
        }
      }
      const imageId = imageIdFromUpload;
      const body = form.content.trim();
      const title = form.title.trim();
      const author = form.author?.trim() || null;
      const publishedAt = form.published ? new Date().toISOString() : null;

      const editingItem = editingId ? list.find((i) => String(i.id) === String(editingId)) : null;
      const editKey = editingItem?.documentId ?? editingId;
      const doRequest = (payload) =>
        editingId
          ? authFetch(apiUrl(`/api/${STRAPI_NEWS_API}/${editKey}`), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : authFetch(apiUrl(`/api/${STRAPI_NEWS_API}`), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

      const parseError = async (res) => {
        const errBody = await res.json().catch(() => ({}));
        const details = errBody?.error?.details?.errors;
        const list = Array.isArray(details) ? details.map((e) => (e.path?.join?.('.') || e.path) + ': ' + (e.message || '')).join('; ') : '';
        const msg = errBody?.error?.message || list || errBody?.error?.name;
        return (
          msg ||
          (res.status === 400 ? 'Strapi талбар буруу эсвэл шаардлага хангаагүй. (400)' : res.status === 403 ? 'Эрх хүрэхгүй.' : 'Мэдээ нэмэхэд алдаа гарлаа.')
        );
      };

      const descriptionBlocks = [{ type: 'paragraph', children: [{ type: 'text', text: body || ' ' }] }];
      const hasImage = imageId != null;
      const payloads = [
        hasImage && { data: { Title: title, Description: descriptionBlocks, ...(author && { Author: author }), Image: [imageId], ...(publishedAt && { publishedAt }) } },
        hasImage && { data: { Title: title, Description: descriptionBlocks, ...(author && { Author: author }), Image: imageId, ...(publishedAt && { publishedAt }) } },
        { data: { title, content: body, ...(hasImage && imageId != null && { image: imageId }), ...(publishedAt && { publishedAt }) } },
        { data: { title, content: body, ...(hasImage && imageId != null && { image: imageId }) } },
        { data: { Title: title, Description: descriptionBlocks, ...(author && { Author: author }), ...(publishedAt && { publishedAt }) } },
        { data: { title, content: body, ...(publishedAt && { publishedAt }) } },
      ].filter(Boolean);

      let res = null;
      let lastErr = '';
      for (const payload of payloads) {
        res = await doRequest(payload);
        if (res.ok) break;
        if (res.status === 400) lastErr = await parseError(res);
        else break;
      }

      if (!res || !res.ok) {
        let msg = lastErr || (res ? await parseError(res) : 'Мэдээ нэмэхэд алдаа гарлаа.');
        if (res?.status === 404) msg = 'Мэдээ олдсонгүй (404). Дараагийн удаа дахин оролдоно уу.';
        throw new Error(msg);
      }
      setError('');
      resetForm();
      fetchNews();
    } catch (e) {
      setError(e.message || 'Алдаа гарлаа.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', content: '', author: '', published: false });
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      author: item.author || '',
      published: item.published,
    });
    setEditingId(item.id);
    setImagePreview(item.imageUrl);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Энэ мэдээг устгах уу?')) return;
    try {
      const key = item.documentId ?? item.id;
      const res = await authFetch(apiUrl(`/api/${STRAPI_NEWS_API}/${key}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгахад алдаа гарлаа.');
      fetchNews();
    } catch (e) {
      setError(e.message);
    }
  };

  const togglePublish = async (item) => {
    const newPublished = !item.published;
    const key = item.documentId ?? item.id;
    try {
      const res = await authFetch(apiUrl(`/api/${STRAPI_NEWS_API}/${key}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            title: item.title,
            content: item.content,
            ...(item.author && { author: item.author }),
            publishedAt: newPublished ? new Date().toISOString() : null,
            ...(item.imageId != null && { image: item.imageId }),
          },
        }),
      });
      if (!res.ok) throw new Error('Төлөв солиход алдаа гарлаа.');
      fetchNews();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="news-management">
      <div className="news-management-header">
        <h1>Мэдээний удирдлага</h1>
        <button type="button" className="btn-add" onClick={() => { resetForm(); setShowForm(true); }}>
          + Шинэ мэдээ
        </button>
      </div>
      {error && <div className="news-management-error">{error}</div>}

      {showForm && (
        <form className="news-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Мэдээ засах' : 'Шинэ мэдээ'}</h2>
          <div className="form-group">
            <label>Гарчиг (Title)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Тайлбар (Description)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={8}
              required
            />
          </div>
          <div className="form-group form-row-two">
            <div className="form-group">
              <label>Зураг (Image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                key={editingId ?? 'new'}
              />
              {imageFile && <p className="form-file-name">{imageFile.name}</p>}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Зохиогч (Author)</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Нэр оруулна уу"
              />
            </div>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              Нэвтрүүлэх (сайт дээр харагдана)
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={submitLoading}>
              {submitLoading ? 'Хадгалж байна...' : editingId ? 'Хадгалах' : 'Нэмэх'}
            </button>
            <button type="button" onClick={resetForm} disabled={submitLoading}>Цуцлах</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="news-loading">Ачааллаж байна...</p>
      ) : list.length === 0 ? (
        <p className="news-empty">Мэдээ байхгүй байна. Шинэ мэдээ нэмнэ үү.</p>
      ) : (
        <ul className="news-list">
          {list.map((item) => (
            <li key={item.id} className="news-item">
              <div className="news-item-main">
                {item.imageUrl && (
                  <div className="news-item-image">
                    <img src={item.imageUrl} alt={item.title} />
                  </div>
                )}
                <div className="news-item-body">
                  <h3>{item.title}</h3>
                  <p className="news-item-date">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Ноорог'}
                  </p>
                  <p className="news-item-content">{item.content.slice(0, 150)}…</p>
                </div>
              </div>
              <div className="news-item-actions">
                <button type="button" className="btn-publish" onClick={() => togglePublish(item)}>
                  {item.published ? 'Ноорог болгох' : 'Нэвтрүүлэх'}
                </button>
                <button type="button" className="btn-edit" onClick={() => handleEdit(item)}>Засах</button>
                <button type="button" className="btn-delete" onClick={() => handleDelete(item)}>Устгах</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsManagement;
