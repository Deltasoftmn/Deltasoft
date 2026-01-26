import React, { useState, useEffect } from 'react';
import './WebStatistics.css';

const WebStatistics = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    totalContacts: 0,
    pendingQuotes: 0
  });

  useEffect(() => {
    // Fetch statistics from API
    fetch('/api/admin/statistics')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats(data);
        }
      })
      .catch(err => {
        console.error('Error fetching statistics:', err);
        // Set default values for demo
        setStats({
          totalVisits: 1250,
          todayVisits: 45,
          totalContacts: 89,
          pendingQuotes: 12
        });
      });
  }, []);

  return (
    <div className="web-statistics">
      <h1 className="section-title">Веб Статистик</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-label">Нийт Зочилсон</h3>
            <p className="stat-value">{stats.totalVisits.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-label">Өнөөдрийн Зочилсон</h3>
            <p className="stat-value">{stats.todayVisits.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3 className="stat-label">Нийт Холбоо Барилт</h3>
            <p className="stat-value">{stats.totalContacts.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-label">Хүлээгдэж Буй Үнийн Санал</h3>
            <p className="stat-value">{stats.pendingQuotes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="stats-chart">
        <h2 className="chart-title">Сүүлийн 7 Хоногийн Статистик</h2>
        <div className="chart-placeholder">
          <p>График энд харагдана</p>
        </div>
      </div>
    </div>
  );
};

export default WebStatistics;

