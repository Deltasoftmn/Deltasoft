import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiUrl, STRAPI_NEWS_API, STRAPI_URL } from '../api';
import BackButton from './BackButton';
import './News.css';

/** Extract plain text from Strapi Description: string or blocks array [{ type, children: [{ text }] }] */
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

const NEWS_CARD_PREVIEW_LENGTH = 150;

/** Parse one item from Strapi: flat (Title, Description, Image[]) or nested (attributes) */
function parseNewsItem(d) {
  if (!d) return null;
  const flat = d.Title != null;
  const title = flat ? (d.Title || '') : (d.attributes?.title || '');
  const body = flat ? d.Description : (d.attributes?.content ?? d.attributes?.description ?? '');
  const content = descriptionToText(body);
  const author = flat ? (d.Author || '') : (d.attributes?.author || '');
  const created_at = flat ? (d.publishedAt || d.createdAt) : (d.attributes?.publishedAt || d.attributes?.createdAt);
  let imageUrl = null;
  if (flat && Array.isArray(d.Image) && d.Image[0]) {
    imageUrl = d.Image[0].url || d.Image[0].formats?.medium?.url;
  } else if (!flat) {
    const img = d.attributes?.image?.data?.attributes ?? d.attributes?.image?.data;
    imageUrl = img?.url || img?.formats?.medium?.url;
  }
  const documentId = flat ? d.documentId : d.documentId ?? d.attributes?.documentId;
  return {
    id: d.id,
    documentId: documentId || null,
    title,
    content,
    author,
    created_at: created_at || (flat ? d.publishedAt : d.attributes?.publishedAt),
    publishedAt: flat ? d.publishedAt : d.attributes?.publishedAt,
    image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : apiUrl(imageUrl)) : null,
  };
}

const News = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    } else {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    setError(null);
    setLoading(true);
    try {
      const url = apiUrl(`/api/${STRAPI_NEWS_API}?populate=*&sort=createdAt:desc`);
      let response = await fetch(url);
      if (response.status === 400) {
        response = await fetch(apiUrl(`/api/${STRAPI_NEWS_API}?populate=*`));
      }
      if (!response.ok) {
        const msg = response.status === 403 ? 'Эрх хүрэхгүй байна. Strapi дээр newss "find" эрхийг Public болгоно уу.' : 'Мэдээ татахад алдаа гарлаа.';
        throw new Error(msg);
      }
      const json = await response.json().catch(() => ({}));
      const raw = json.data ?? json.docs ?? json;
      const arr = Array.isArray(raw) ? raw : raw != null && typeof raw === 'object' ? [raw] : [];
      const list = arr.map(parseNewsItem).filter(Boolean);
      setNews(list);
    } catch (err) {
      console.error('Error fetching news:', err);
      const isProduction = typeof window !== 'undefined' && !/localhost|127\.0\.0\.1/.test(window.location.hostname);
      const needsStrapiUrl = !STRAPI_URL && isProduction;
      const message = needsStrapiUrl
        ? 'Мэдээ татахад алдаа гарлаа. Vercel дээр REACT_APP_STRAPI_URL тохируулна уу (Settings → Environment Variables).'
        : (err.message || 'Мэдээ татахад алдаа гарлаа.');
      setError(message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async (articleId) => {
    setError(null);
    setLoading(true);
    setArticle(null);
    try {
      let url = apiUrl(`/api/${STRAPI_NEWS_API}/${articleId}?populate=*`);
      let response = await fetch(url);
      if (!response.ok && (response.status === 404 || response.status === 400)) {
        const listUrl = apiUrl(`/api/${STRAPI_NEWS_API}?populate=*`);
        const listRes = await fetch(listUrl);
        if (listRes.ok) {
          const listJson = await listRes.json().catch(() => ({}));
          const raw = listJson.data ?? listJson.docs ?? listJson;
          const arr = Array.isArray(raw) ? raw : raw != null && typeof raw === 'object' ? [raw] : [];
          const found = arr.find((d) => String(d.id) === String(articleId) || d.documentId === articleId);
          if (found) {
            setArticle(parseNewsItem(found));
            setLoading(false);
            return;
          }
        }
      }
      if (!response.ok) throw new Error('Мэдээ олдсонгүй.');
      const json = await response.json().catch(() => ({}));
      const raw = json.data ?? json;
      const item = Array.isArray(raw) ? raw[0] : raw;
      setArticle(item ? parseNewsItem(item) : null);
    } catch (err) {
      console.error('Error fetching article:', err);
      const isProduction = typeof window !== 'undefined' && !/localhost|127\.0\.0\.1/.test(window.location.hostname);
      const needsStrapiUrl = !STRAPI_URL && isProduction;
      setError(needsStrapiUrl
        ? 'Мэдээ татахад алдаа гарлаа. Vercel дээр REACT_APP_STRAPI_URL тохируулна уу.'
        : (err.message || 'Мэдээ татахад алдаа гарлаа.'));
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    return (
      <div className="news-page">
        <div className="news-container news-article-container">
          <button type="button" className="news-article-back" onClick={() => navigate('/news')}>
            ← Мэдээний жагсаалт
          </button>
          {loading ? (
            <div className="news-loading">Ачааллаж байна...</div>
          ) : error ? (
            <div className="news-error">
              <p>{error}</p>
              <button type="button" className="news-retry" onClick={() => navigate('/news')}>Жагсаалт руу буцах</button>
            </div>
          ) : article ? (
            <article className="news-article">
              {article.image && (
                <div className="news-article-image">
                  <img src={article.image} alt={article.title} />
                </div>
              )}
              <div className="news-article-body">
                <h1 className="news-article-title">{article.title}</h1>
                {(article.created_at || article.publishedAt) && (
                  <p className="news-article-date">
                    {new Date(article.created_at || article.publishedAt).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
                {article.author && <p className="news-article-author">{article.author}</p>}
                <div className="news-article-text">{article.content}</div>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-container" data-aos="fade-up">
        <BackButton />
        <h1 className="news-title">МЭДЭЭ</h1>
        <div className="news-divider" />

        {loading ? (
          <div className="news-loading">Ачааллаж байна...</div>
        ) : error ? (
          <div className="news-error">
            <p>{error}</p>
            <button type="button" className="news-retry" onClick={fetchNews}>Дахин оролдох</button>
          </div>
        ) : !Array.isArray(news) || news.length === 0 ? (
          <p className="news-placeholder">
            Мэдээ байхгүй байна. Шинэ мэдээ нэмэхэд энд харагдана.
          </p>
        ) : (
          <div className="news-grid">
            {news.map((newsItem) => (
              <Link key={newsItem.id} to={`/news/${newsItem.documentId ?? newsItem.id}`} className="news-card-link">
                <article className="news-card" data-aos="fade-up">
                  {newsItem.image && (
                    <div className="news-card-image">
                      <img src={newsItem.image} alt={newsItem.title} />
                    </div>
                  )}
                  <div className="news-card-content">
                    <h2 className="news-card-title">{newsItem.title}</h2>
                    {(newsItem.created_at || newsItem.publishedAt) && (
                      <p className="news-card-date">
                        {new Date(newsItem.created_at || newsItem.publishedAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    {newsItem.author && <p className="news-card-author">{newsItem.author}</p>}
                    <p className="news-card-text">
                      {newsItem.content && newsItem.content.length > NEWS_CARD_PREVIEW_LENGTH
                        ? `${newsItem.content.slice(0, NEWS_CARD_PREVIEW_LENGTH).trim()}…`
                        : newsItem.content}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
