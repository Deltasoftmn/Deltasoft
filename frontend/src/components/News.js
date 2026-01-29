import React, { useState, useEffect } from 'react';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
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
