import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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

  // Auto-play carousel (pause on hover/touch)
  useEffect(() => {
    let interval;
    const startInterval = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    };

    startInterval();

    // Pause on hover
    const carousel = document.querySelector('.hero-carousel-wrapper');
    if (carousel) {
      const handleMouseEnter = () => clearInterval(interval);
      const handleMouseLeave = () => startInterval();
      
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        clearInterval(interval);
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

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

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={goToPrevious}>
            ‹
          </button>
          <div 
            className="hero-carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
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
                      </div>
                    </div>
                    <div className="hero-right">
                      <div className="hero-image-container">
                        <div className="hero-badge">{slide.badge}</div>
                        <div className="hero-product-image">
                          <img src={slide.image} alt={slide.productTitle} />
                        </div>
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
        <a
          href="https://www.facebook.com/Deltasoftllc"
          className="social-icon facebook"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          f
        </a>
      </div>
    </section>
  );
};

export default Hero;

