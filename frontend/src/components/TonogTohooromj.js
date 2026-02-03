import React, { useState } from 'react';
import { apiUrl } from '../api';
import './TonogTohooromj.css';

const TonogTohooromj = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    productName: '',
    description: '',
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
    if (!formData.name || !formData.phone) {
      setStatus({ type: 'error', message: 'Нэр болон утасны дугаараа оруулна уу.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const tailbarBlocks = formData.description
        ? [{ type: 'paragraph', children: [{ type: 'text', text: formData.description }] }]
        : [];
      const res = await fetch(apiUrl('/api/tonog-tuhuurumjs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            ner: formData.name.trim(),
            Utas: formData.phone.trim(),
            buteegdhuun: (formData.productName || '').trim(),
            tailbar: tailbarBlocks,
          },
        }),
      });
      let data = {};
      try {
        const text = await res.text();
        if (text) data = JSON.parse(text);
      } catch {
        if (!res.ok) data = { error: { message: 'Сервер буруу хариу буцаалсан.' } };
      }
      if (!res.ok) {
        const msg =
          data.error?.message ||
          data.error?.details?.errors?.[0]?.message ||
          (res.status === 403 ? 'Эрх байхгүй. Strapi-д Tonog-tuhuurumj-ийн create эрхийг Public-д нээж өгнө үү.' : 'Илгээхэд алдаа гарлаа.');
        throw new Error(msg);
      }
      setStatus({ type: 'success', message: 'Захиалга амжилттай илгээгдлээ. Бид тантай холбогдоно.' });
      setFormData({ name: '', phone: '', productName: '', description: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Захиалга илгээхэд алдаа гарлаа. Дахин оролдоно уу.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tonog-tohooromj-page">
      <div className="tonog-tohooromj-container">
        <h1 className="tonog-tohooromj-title">ТОНОГ ТӨХӨӨРӨМЖ, ХУДАЛДАА, ЗАСВАР ҮЙЛЧИЛГЭЭ</h1>
        <div className="tonog-tohooromj-divider" />
        <p className="tonog-tohooromj-subtitle">Equipment, Trade & Repair Services</p>

        <section className="tonog-order-form-section" data-aos="fade-up">
          <h2 className="tonog-order-form-title">Тоног төхөөрөмж захиалах хуудас</h2>
          <form className="tonog-order-form" onSubmit={handleSubmit}>
            <div className="tonog-form-group">
              <label htmlFor="tonog-name">Таны нэр</label>
              <input
                id="tonog-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Нэрээ оруулна уу"
              />
            </div>
            <div className="tonog-form-group">
              <label htmlFor="tonog-phone">Таны утасны дугаар / Холбогдох дугаар</label>
              <input
                id="tonog-phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+976 ..."
              />
            </div>
            <div className="tonog-form-group">
              <label htmlFor="tonog-product">Бүтээгдэхүүнийн нэр</label>
              <input
                id="tonog-product"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Бүтээгдэхүүний нэрийг оруулна уу"
              />
            </div>
            <div className="tonog-form-group">
              <label htmlFor="tonog-desc">Товч тайлбар</label>
              <textarea
                id="tonog-desc"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Товч тайлбар бичнэ үү"
              />
            </div>
            {status.message && (
              <div className={`tonog-form-status ${status.type}`}>{status.message}</div>
            )}
            <button type="submit" className="tonog-order-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Илгээж байна...' : 'Захиалах'}
            </button>
          </form>
          <p className="tonog-order-note">
            Бид тантай ажлын 4–24 цагийн дотор эргээд холбоо барих болно.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TonogTohooromj;
