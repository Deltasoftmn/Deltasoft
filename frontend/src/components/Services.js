import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Гэрээт ІТ үйлчилгээ",
      icon: "💻",
      description: "IT outsourcing services"
    },
    {
      title: "МАБ-ын Outsourcing үйлчилгээ",
      icon: "💼",
      description: "MAB outsourcing services"
    },
    {
      title: "Вэб сайт, Програм хангамж хөгжүүлэх",
      icon: "🌐",
      description: "Website & Software Development"
    },
    {
      title: "Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ",
      icon: "🔧",
      description: "Equipment, Trade & Repair Services"
    },
    {
      title: "Social хуудас болон котент хөгжүүлэлт",
      icon: "📱",
      description: "Social Pages & Content Development"
    },
    {
      title: "Дэлгэцийн реклам",
      icon: "📢",
      description: "Display Advertising"
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

