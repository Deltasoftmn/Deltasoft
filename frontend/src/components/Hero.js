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
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop&q=80",
      productTitle: "Enterprise Cloud Platform",
      badge: "NEW"
    },
    {
      title: "WEB DEVELOPMENT",
      subtitle: "CUSTOM SOLUTIONS",
      description: "Build scalable web applications for your business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&q=80",
      productTitle: "Full-Stack Development",
      badge: "HOT"
    },
    {
      title: "MOBILE APPS",
      subtitle: "NATIVE & CROSS-PLATFORM",
      description: "iOS and Android applications built to perfection",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=1080&fit=crop&q=80",
      productTitle: "Mobile Application Suite",
      badge: "POPULAR"
    },
    {
      title: "CLOUD SERVICES",
      subtitle: "INFRASTRUCTURE & MIGRATION",
      description: "Seamless cloud migration and management",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80",
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
              />
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

