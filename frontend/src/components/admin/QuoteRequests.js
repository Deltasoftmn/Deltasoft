import React, { useState, useEffect } from 'react';
import './QuoteRequests.css';

const QuoteRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      // Filter for quote requests (you can add a field to distinguish quotes)
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // Demo data
      setQuotes([
        {
          _id: '1',
          name: 'Батбаяр',
          email: 'batbayar@example.com',
          phone: '+976 99112233',
          message: 'Вэб сайт хөгжүүлэх үйлчилгээний үнэ хэд вэ?',
          status: 'new',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Сараа',
          email: 'saraa@example.com',
          phone: '+976 99223344',
          message: 'Мобайл апп хөгжүүлэх үнэ санал авах хүсэлтэй байна.',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status via API
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setQuotes(quotes.map(quote =>
        quote._id === id ? { ...quote, status: newStatus } : quote
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      // Update locally for demo
      setQuotes(quotes.map(quote =>
        quote._id === id ? { ...quote, status: newStatus } : quote
      ));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Энэ үнийн саналыг устгахдаа итгэлтэй байна уу?')) {
      try {
        await fetch(`/api/contact/${id}`, { method: 'DELETE' });
        setQuotes(quotes.filter(quote => quote._id !== id));
      } catch (error) {
        console.error('Error deleting quote:', error);
        setQuotes(quotes.filter(quote => quote._id !== id));
      }
    }
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  return (
    <div className="quote-requests">
      <h1 className="section-title">Үнийн Санал</h1>

      <div className="quotes-stats">
        <div className="quote-stat-card">
          <span className="stat-number">{quotes.length}</span>
          <span className="stat-label">Нийт Үнийн Санал</span>
        </div>
        <div className="quote-stat-card">
          <span className="stat-number">{quotes.filter(q => q.status === 'new').length}</span>
          <span className="stat-label">Шинэ</span>
        </div>
        <div className="quote-stat-card">
          <span className="stat-number">{quotes.filter(q => q.status === 'read').length}</span>
          <span className="stat-label">Уншсан</span>
        </div>
      </div>

      <div className="quotes-list">
        {quotes.length === 0 ? (
          <div className="empty-state">
            <p>Үнийн санал байхгүй байна</p>
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote._id} className={`quote-card ${quote.status}`}>
              <div className="quote-header">
                <div className="quote-info">
                  <h3 className="quote-name">{quote.name}</h3>
                  <p className="quote-email">{quote.email}</p>
                  {quote.phone && <p className="quote-phone">{quote.phone}</p>}
                </div>
                <div className="quote-meta">
                  <span className="quote-date">
                    {new Date(quote.createdAt).toLocaleDateString('mn-MN')}
                  </span>
                  <span className={`status-badge ${quote.status}`}>
                    {quote.status === 'new' ? 'Шинэ' : quote.status === 'read' ? 'Уншсан' : 'Хариулсан'}
                  </span>
                </div>
              </div>
              <div className="quote-message">
                <p>{quote.message}</p>
              </div>
              <div className="quote-actions">
                <select
                  value={quote.status}
                  onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">Шинэ</option>
                  <option value="read">Уншсан</option>
                  <option value="replied">Хариулсан</option>
                </select>
                <button
                  className="delete-quote-btn"
                  onClick={() => handleDelete(quote._id)}
                >
                  Устгах
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuoteRequests;

