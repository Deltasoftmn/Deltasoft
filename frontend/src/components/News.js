import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(apiUrl('/api/news?populate=image&sort=createdAt:desc'));
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const json = await response.json();
      const raw = json.data;
      const list = Array.isArray(raw)
        ? raw.map((d) => ({
            id: d.id,
            title: d.attributes?.title || '',
            content: d.attributes?.content || '',
            created_at: d.attributes?.createdAt || d.attributes?.publishedAt,
            image: d.attributes?.image?.data?.attributes?.url || d.attributes?.image?.data?.attributes?.formats?.medium?.url || null,
          }))
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
