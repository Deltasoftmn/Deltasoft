import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Гэрээт IT үйлчилгээ",
      icon: "💻",
      description: "IT outsourcing services"
    },
    {
      title: "Камер, Дэд бүтцийн шийдэл",
      icon: "📹",
      description: "Camera & Infrastructure solutions"
    },
    {
      title: "Суурилуулалт, тохируулах үйлчилгээ",
      icon: "🔧",
      description: "Installation & configuration services"
    },
    {
      title: "Вэб сайт хөгжүүлэх",
      icon: "🌐",
      description: "Web development"
    },
    {
      title: "МАБ-ын зөвлөх, гэрээт үйлчилгээ",
      icon: "💼",
      description: "ERP consulting & contract services"
    },
    {
      title: "Social Content Marketing үйлчилгээ",
      icon: "📱",
      description: "Social content marketing services"
    }
  ];

  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

