import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
import './Delgets.css';

const IMAGES = [
  '/delgets1.png',
  '/delgets2.png',
  '/delgets3.png',
  '/delgets4.png',
  '/delgets5.png',
  '/delgets6.png',
  '/delgets7.png',
  '/delgets8.png',
];

const Delgets = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrentSlide(i);
  const prev = () => setCurrentSlide((p) => (p - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setCurrentSlide((p) => (p + 1) % IMAGES.length);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const d = touchStart - touchEnd;
    if (d > 50) next();
    else if (d < -50) prev();
  };

  return (
    <div className="delgets-page">
      <div className="delgets-container">
        <BackButton />
        <h1 className="delgets-title">ДЭЛГЭЦ</h1>
        <div className="delgets-divider" />

        <div className="delgets-carousel-wrap" data-aos="fade-up">
          <button type="button" className="delgets-arrow delgets-arrow-left" onClick={prev} aria-label="Өмнөх">‹</button>
          <div
            className="delgets-carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {IMAGES.map((src, i) => (
              <div
                key={src}
                className={`delgets-slide ${i === currentSlide ? 'active' : ''}`}
              >
                <img src={src} alt={`Дэлгэц ${i + 1}`} />
              </div>
            ))}
          </div>
          <button type="button" className="delgets-arrow delgets-arrow-right" onClick={next} aria-label="Дараах">›</button>
        </div>
        <div className="delgets-dots">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`delgets-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Delgets;
