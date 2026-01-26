import React, { useState } from 'react';
import './QuoteModal.css';

const QuoteModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Нэр, и-мэйл болон мессежийг бөглөнө үү.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.service
            ? `[Үнийн санал - ${formData.service}] ${formData.message}`
            : `[Үнийн санал] ${formData.message}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send quote');
      }

      setStatus({ type: 'success', message: 'Үнийн санал амжилттай илгээгдлээ.' });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Үнийн санал илгээхэд алдаа гарлаа. Дахин оролдоно уу.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quote-modal-backdrop" onClick={onClose}>
      <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quote-modal-header">
          <h2>Үнийн санал авах</h2>
          <button className="quote-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="quote-modal-subtitle">
          Төслийнхаа талаар товч мэдээлэл үлдээгээрэй. Манай баг тантай эргэн холбогдож
          дэлгэрэнгүй үнийн санал илгээнэ.
        </p>

        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="quote-form-row">
            <div className="quote-form-group">
              <label htmlFor="q-name">Таны нэр</label>
              <input
                id="q-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Нэрээ оруулна уу"
              />
            </div>
            <div className="quote-form-group">
              <label htmlFor="q-email">Таны и-мэйл</label>
              <input
                id="q-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@company.mn"
              />
            </div>
          </div>

          <div className="quote-form-row">
            <div className="quote-form-group">
              <label htmlFor="q-phone">Утас</label>
              <input
                id="q-phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+976 ..."
              />
            </div>
            <div className="quote-form-group">
              <label htmlFor="q-service">Үйлчилгээ</label>
              <select
                id="q-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Сонгох</option>
                <option value="Вэб сайт хөгжүүлэх">Вэб сайт хөгжүүлэх</option>
                <option value="Мобайл апп хөгжүүлэх">Мобайл апп хөгжүүлэх</option>
                <option value="Камер, дэд бүтэц">Камер, дэд бүтцийн шийдэл</option>
                <option value="Гэрээт IT үйлчилгээ">Гэрээт IT үйлчилгээ</option>
                <option value="Бусад">Бусад</option>
              </select>
            </div>
          </div>

          <div className="quote-form-group">
            <label htmlFor="q-message">Төслийн товч тайлбар</label>
            <textarea
              id="q-message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Төслийн зорилго, хүрээ, хугацаа, төсөөлж буй төсвийн талаар бичээрэй..."
            ></textarea>
          </div>

          {status.message && (
            <div className={`quote-status ${status.type}`}>{status.message}</div>
          )}

          <div className="quote-actions">
            <button
              type="button"
              className="quote-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Болих
            </button>
            <button type="submit" className="quote-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Илгээж байна...' : 'Үнийн санал илгээх'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;


