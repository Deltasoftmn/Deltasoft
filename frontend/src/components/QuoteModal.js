import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';
import './QuoteModal.css';

const SERVICE_TONOG = 'Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ';

const QuoteModal = ({ onClose }) => {
  const navigate = useNavigate();
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
    if (name === 'service' && value === SERVICE_TONOG) {
      onClose();
      navigate('/tonog-tohooromj');
      return;
    }
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
      // Strapi rich-text (blocks) for tailbar
      const tailbarBlocks = [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: formData.message || '' }],
        },
      ];

      const res = await fetch(apiUrl('/api/uniin-sanals'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            Ner: formData.name,
            email: formData.email,
            Utas: formData.phone || '',
            Uilchilgee: formData.service || '',
            tailbar: tailbarBlocks,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error?.message || data.error?.details?.errors?.[0]?.message || 'Failed to send quote';
        throw new Error(msg);
      }

      setStatus({ type: 'success', message: 'Үнийн санал амжилттай илгээгдлээ.' });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Үнийн санал илгээхэд алдаа гарлаа. Дахин оролдоно уу.',
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
                <option value="Гэрээт ІТ үйлчилгээ">Гэрээт ІТ үйлчилгээ</option>
                <option value="МАБ-ын Outsourcing үйлчилгээ">МАБ-ын Outsourcing үйлчилгээ</option>
                <option value="Вэб сайт, Програм хангамж хөгжүүлэх">Вэб сайт, Програм хангамж хөгжүүлэх</option>
                <option value="Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ">Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ</option>
                <option value="Social хуудас болон котент хөгжүүлэлт">Social хуудас болон котент хөгжүүлэлт</option>
                <option value="Дэлгэцийн реклам">Дэлгэцийн реклам</option>
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


