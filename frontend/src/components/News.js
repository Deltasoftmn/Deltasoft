import React from 'react';
import './News.css';

const News = () => {
  return (
    <div className="news-page">
      <div className="news-container" data-aos="fade-up">
        <h1 className="news-title">МЭДЭЭ</h1>
        <div className="news-divider" />
        <p className="news-placeholder">
          Мэдээ, мэдээлэл энд харагдана.
        </p>
      </div>
    </div>
  );
};

export default News;
