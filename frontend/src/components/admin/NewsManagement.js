import React, { useState, useEffect } from 'react';
import './NewsManagement.css';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    published: false,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/all');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      // Ensure data is always an array
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Upload error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload success:', data);
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image || '';

      // Upload image if a new file is selected
      if (selectedImage) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Зураг илгээхэд алдаа гарлаа: ' + (error.message || 'Unknown error'));
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const submitData = {
        title: formData.title,
        content: formData.content,
        image: imageUrl || null,
        published: formData.published,
      };

      let response;
      if (editingNews) {
        // Update existing news
        response = await fetch(`/api/news/${editingNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
      } else {
        // Create new news
        response = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to save news');
      }

      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Мэдээ хадгалахад алдаа гарлаа: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      image: newsItem.image || '',
      published: newsItem.published || false,
    });
    setSelectedImage(null);
    setImagePreview(newsItem.image || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Энэ мэдээг устгахдаа итгэлтэй байна уу?')) {
      try {
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Мэдээ устгахад алдаа гарлаа');
      }
    }
  };

  const togglePublish = async (newsItem) => {
    try {
      await fetch(`/api/news/${newsItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !newsItem.published }),
      });
      fetchNews();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
      published: false,
    });
    setEditingNews(null);
    setSelectedImage(null);
    setImagePreview(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  return (
    <div className="news-management">
      <div className="news-header">
        <h1 className="section-title">Мэдээний Удирдлага</h1>
        <button className="add-news-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Цуцлах' : '+ Шинэ Мэдээ Нэмэх'}
        </button>
      </div>

      {showForm && (
        <form className="news-form" onSubmit={handleSubmit}>
          <h2>{editingNews ? 'Мэдээ Засах' : 'Шинэ Мэдээ Нэмэх'}</h2>
          <div className="form-group">
            <label>Гарчиг</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Агуулга</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="8"
              required
            />
          </div>
          <div className="form-group">
            <label>Зураг (сонголттой)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setFormData({ ...formData, image: '' });
                  }}
                >
                  ✕ Устгах
                </button>
              </div>
            )}
            {editingNews && formData.image && !imagePreview && (
              <div className="image-preview">
                <img src={formData.image} alt="Current" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setFormData({ ...formData, image: '' });
                  }}
                >
                  ✕ Устгах
                </button>
              </div>
            )}
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
              />
              Нэвтрүүлэх (публик болгох)
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={uploadingImage}>
              {uploadingImage ? 'Зураг илгээж байна...' : editingNews ? 'Хадгалах' : 'Нэмэх'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm} disabled={uploadingImage}>
              Цуцлах
            </button>
          </div>
        </form>
      )}

      <div className="news-stats">
        <div className="news-stat-card">
          <span className="stat-number">{Array.isArray(news) ? news.length : 0}</span>
          <span className="stat-label">Нийт Мэдээ</span>
        </div>
        <div className="news-stat-card">
          <span className="stat-number">
            {Array.isArray(news) ? news.filter((n) => n.published).length : 0}
          </span>
          <span className="stat-label">Нэвтрүүлсэн</span>
        </div>
        <div className="news-stat-card">
          <span className="stat-number">
            {Array.isArray(news) ? news.filter((n) => !n.published).length : 0}
          </span>
          <span className="stat-label">Ноорог</span>
        </div>
      </div>

      <div className="news-list">
        {!Array.isArray(news) || news.length === 0 ? (
          <div className="empty-state">
            <p>Мэдээ байхгүй байна</p>
          </div>
        ) : (
          news.map((newsItem) => (
            <div key={newsItem.id} className="news-card">
              <div className="news-card-header">
                <div className="news-card-info">
                  <h3 className="news-card-title">{newsItem.title}</h3>
                  <span className="news-card-date">
                    {new Date(newsItem.created_at).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="news-card-actions">
                  <button
                    className={`publish-btn ${newsItem.published ? 'published' : 'draft'}`}
                    onClick={() => togglePublish(newsItem)}
                  >
                    {newsItem.published ? '✓ Нэвтрүүлсэн' : '○ Ноорог'}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(newsItem)}
                  >
                    Засах
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(newsItem.id)}
                  >
                    Устгах
                  </button>
                </div>
              </div>
              {newsItem.image && (
                <div className="news-card-image">
                  <img src={newsItem.image} alt={newsItem.title} />
                </div>
              )}
              <div className="news-card-content">
                <p>{newsItem.content.substring(0, 200)}...</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsManagement;
