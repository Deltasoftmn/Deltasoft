import React, { useState } from 'react';
import './CarouselControl.css';

const CarouselControl = () => {
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: "OFFICIALLY LAUNCHED",
      subtitle: "ENTERPRISE SOLUTIONS",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      badge: "NEW",
      active: true
    },
    {
      id: 2,
      title: "WEB DEVELOPMENT",
      subtitle: "CUSTOM SOLUTIONS",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      badge: "HOT",
      active: true
    },
    {
      id: 3,
      title: "MOBILE APPS",
      subtitle: "NATIVE & CROSS-PLATFORM",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      badge: "POPULAR",
      active: true
    },
    {
      id: 4,
      title: "CLOUD SERVICES",
      subtitle: "INFRASTRUCTURE & MIGRATION",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      badge: "TRENDING",
      active: true
    }
  ]);

  const [editingSlide, setEditingSlide] = useState(null);

  const handleAddSlide = () => {
    const newSlide = {
      id: slides.length + 1,
      title: "NEW SLIDE",
      subtitle: "SUBTITLE",
      image: "",
      badge: "NEW",
      active: true
    };
    setSlides([...slides, newSlide]);
    setEditingSlide(newSlide.id);
  };

  const handleDeleteSlide = (id) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    } else {
      alert('Хамгийн багадаа 1 караусл байх ёстой');
    }
  };

  const handleToggleActive = (id) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, active: !slide.active } : slide
    ));
  };

  const handleSave = (id, updatedSlide) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, ...updatedSlide } : slide
    ));
    setEditingSlide(null);
  };

  return (
    <div className="carousel-control">
      <div className="control-header">
        <h1 className="section-title">Карауслын Удирдлага</h1>
        <button className="add-slide-btn" onClick={handleAddSlide}>
          + Шинэ Караусл Нэмэх
        </button>
      </div>

      <div className="slides-list">
        {slides.map((slide) => (
          <div key={slide.id} className={`slide-card ${!slide.active ? 'inactive' : ''}`}>
            <div className="slide-preview">
              <img src={slide.image || '/placeholder.jpg'} alt={slide.title} />
              <div className="slide-overlay">
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
                <span className="slide-badge">{slide.badge}</span>
              </div>
            </div>
            <div className="slide-controls">
              <div className="slide-info">
                <h4>{slide.title}</h4>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <span className={`status-badge ${slide.active ? 'active' : 'inactive'}`}>
                  {slide.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                </span>
              </div>
              <div className="slide-actions">
                <button
                  className="toggle-btn"
                  onClick={() => handleToggleActive(slide.id)}
                >
                  {slide.active ? 'Идэвхгүй Болгох' : 'Идэвхжүүлэх'}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => setEditingSlide(slide.id)}
                >
                  Засах
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSlide(slide.id)}
                >
                  Устгах
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingSlide && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Караусл Засах</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSave(editingSlide, {
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                image: formData.get('image'),
                badge: formData.get('badge')
              });
            }}>
              <div className="form-group">
                <label>Гарчиг</label>
                <input type="text" name="title" defaultValue={slides.find(s => s.id === editingSlide)?.title} required />
              </div>
              <div className="form-group">
                <label>Дэд Гарчиг</label>
                <input type="text" name="subtitle" defaultValue={slides.find(s => s.id === editingSlide)?.subtitle} required />
              </div>
              <div className="form-group">
                <label>Зургийн URL</label>
                <input type="url" name="image" defaultValue={slides.find(s => s.id === editingSlide)?.image} required />
              </div>
              <div className="form-group">
                <label>Бэдж</label>
                <input type="text" name="badge" defaultValue={slides.find(s => s.id === editingSlide)?.badge} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Хадгалах</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingSlide(null)}>Цуцлах</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselControl;

