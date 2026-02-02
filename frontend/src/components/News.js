import React, { useState, useEffect } from 'react';
import { apiUrl, STRAPI_NEWS_API } from '../api';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      let response = await fetch(apiUrl(`/api/${STRAPI_NEWS_API}?populate=image&sort=createdAt:desc`));
      if (response.status === 400) {
        response = await fetch(apiUrl(`/api/${STRAPI_NEWS_API}?populate=image`));
      }
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const json = await response.json();
      const raw = json.data;
      const list = Array.isArray(raw)
        ? raw.map((d) => {
            const attrs = d.attributes || {};
            const body = attrs.content ?? attrs.description ?? '';
            const content = typeof body === 'string' ? body : (body?.root?.children?.map((c) => c.children?.map((t) => t.text).join('')).join('') || '');
            const img = attrs.image?.data?.attributes;
            const imageUrl = img?.url || img?.formats?.medium?.url || null;
            return {
              id: d.id,
              title: attrs.title || '',
              content,
              author: attrs.author || '',
              created_at: attrs.createdAt || attrs.publishedAt,
              image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : apiUrl(imageUrl)) : null,
            };
          })
        : [];
      setNews(list);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-page">
      <div className="news-container" data-aos="fade-up">
        <h1 className="news-title">МЭДЭЭ</h1>
        <div className="news-divider" />

        {loading ? (
          <div className="news-loading">Ачааллаж байна...</div>
        ) : !Array.isArray(news) || news.length === 0 ? (
          <p className="news-placeholder">
            Мэдээ, мэдээлэл энд харагдана.
          </p>
        ) : (
          <div className="news-grid">
            {news.map((newsItem) => (
              <article key={newsItem.id} className="news-card" data-aos="fade-up">
                {newsItem.image && (
                  <div className="news-card-image">
                    <img src={newsItem.image} alt={newsItem.title} />
                  </div>
                )}
                <div className="news-card-content">
                  <h2 className="news-card-title">{newsItem.title}</h2>
                  <p className="news-card-date">
                    {new Date(newsItem.created_at).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {newsItem.author && <p className="news-card-author">{newsItem.author}</p>}
                  <p className="news-card-text">{newsItem.content}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
