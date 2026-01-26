import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "OFFICIALLY LAUNCHED",
      subtitle: "ENTERPRISE SOLUTIONS",
      description: "Complete IT outsourcing solutions for your business",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      productTitle: "Enterprise Cloud Platform",
      badge: "NEW"
    },
    {
      title: "WEB DEVELOPMENT",
      subtitle: "CUSTOM SOLUTIONS",
      description: "Build scalable web applications for your business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      productTitle: "Full-Stack Development",
      badge: "HOT"
    },
    {
      title: "MOBILE APPS",
      subtitle: "NATIVE & CROSS-PLATFORM",
      description: "iOS and Android applications built to perfection",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      productTitle: "Mobile Application Suite",
      badge: "POPULAR"
    },
    {
      title: "CLOUD SERVICES",
      subtitle: "INFRASTRUCTURE & MIGRATION",
      description: "Seamless cloud migration and management",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      productTitle: "Cloud Infrastructure",
      badge: "TRENDING"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={goToPrevious}>
            ‹
          </button>
          <div className="hero-carousel">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="hero-slide-overlay">
                  <div className="hero-content">
                    <div className="hero-left">
                      <h1 className="hero-title">{slide.title}</h1>
                      <div className="hero-subsection">
                        <h2 className="subsection-title">{slide.subtitle}</h2>
                        <div className="feature-cards">
                          <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <p>24/7 SUPPORT & MAINTENANCE</p>
                          </div>
                          <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <p>RAPID DEVELOPMENT SERVICES</p>
                          </div>
                          <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <p>SECURITY & COMPLIANCE</p>
                          </div>
                        </div>
                        <div className="bonus-item">
                          <div className="bonus-icon">🎁</div>
                          <div className="bonus-text">Free Consultation</div>
                        </div>
                      </div>
                    </div>
                    <div className="hero-right">
                      <div className="hero-image-container">
                        <div className="hero-badge">{slide.badge}</div>
                        <div className="hero-product-image">
                          <img src={slide.image} alt={slide.productTitle} />
                        </div>
                        <h3 className="hero-product-title">{slide.productTitle}</h3>
                        <button className="details-btn">LEARN MORE</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow carousel-arrow-right" onClick={goToNext}>
            ›
          </button>
        </div>
        <div className="hero-pagination">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
      <div className="social-sidebar">
        <a href="#" className="social-icon facebook">f</a>
        <a href="#" className="social-icon linkedin">in</a>
      </div>
    </section>
  );
};

export default Hero;

