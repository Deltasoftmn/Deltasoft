import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Гэрээт ІТ үйлчилгээ",
      icon: "💻",
      description: "IT outsourcing services",
      to: "/uilchilgee"
    },
    {
      title: "МАБ-ын Outsourcing үйлчилгээ",
      icon: "💼",
      description: "MAB outsourcing services",
      to: "/"
    },
    {
      title: "Вэб сайт, Програм хангамж хөгжүүлэх",
      icon: "🌐",
      description: "Website & Software Development",
      to: "/vev-dev"
    },
    {
      title: "Тоног төхөөрөмж, худалдаа, засвар үйлчилгээ",
      icon: "🔧",
      description: "Equipment, Trade & Repair Services",
      to: "/tonog-tohooromj"
    },
    {
      title: "Social хуудас болон котент хөгжүүлэлт",
      icon: "📱",
      description: "Social Pages & Content Development",
      to: "/"
    },
    {
      title: "Дэлгэцийн реклам",
      icon: "📢",
      description: "Display Advertising",
      to: "/delgets"
    }
  ];

  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-grid" data-aos="stagger">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.to}
              className="service-card aos-stagger-item service-card-link"
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

