import React, { useState } from 'react';
import { apiUrl } from '../api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      setStatus({ type: 'error', message: 'Нэр, и-мэйл болон мессежийг заавал бөглөнө үү.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/contacts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            message: formData.subject
              ? `${formData.subject}\n\n${formData.message}`
              : formData.message,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send');
      }

      setStatus({ type: 'success', message: 'Мессеж амжилттай илгээгдлээ.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">ХОЛБОО БАРИХ</h1>
        <div className="contact-divider" />

        <div className="contact-grid" data-aos="fade-up">
          <div className="contact-info">
            <div className="info-block">
              <div className="info-icon">📍</div>
              <div>
                <h3 className="info-label">Хаяг:</h3>
                <p className="info-text">
                  Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг<br />
                  1-р хороо, ЮүБиЭйч 10-р давхарт 1010 тоот
                </p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">✉️</div>
              <div>
                <h3 className="info-label">И-мэйл:</h3>
                <p className="info-text">info@deltasoft.mn</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">📞</div>
              <div>
                <h3 className="info-label">Утас:</h3>
                <p className="info-text">+976 7533 1177, +976 9502 1177</p>
              </div>
            </div>

            <div className="map-wrapper">
              <iframe
                title="Deltasoft Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363159049!3d-37.81627974202115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE1LjQiRQ!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Таны нэр</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Нэрээ оруулна уу"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Таны мэйлийн хаяг</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@company.mn"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Утас</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+976 ..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Гарчиг</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Гарчиг"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Мэдээлэл</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Мессежээ оруулна уу"
                ></textarea>
              </div>

              {status.message && (
                <div className={`form-status ${status.type}`}>
                  {status.message}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Илгээж байна...' : 'Илгээх'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


