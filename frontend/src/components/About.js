import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-content">
          <h1 className="about-title">БИДНИЙ ТУХАЙ</h1>
          
          <div className="about-intro">
            <p className="about-text">
              Дельтасофт компани нь 2012 онд байгуулагдсан цагаасаа хойш мэдээллийн технологийн салбарт тасралтгүй үйл ажиллагаа явуулж байна. Бид салбартаа олон жил ажилласан дадлага туршлагатай инженерүүдээр багаа бүрдүүлэн ажиллаж байна.
            </p>
          </div>

          <div className="about-services">
            <h2 className="services-heading">Манайх:</h2>
            
            <div className="service-list">
              <div className="service-item">
                <div className="service-bullet">•</div>
                <p className="service-text">
                  Байгууллагын мэдээлэл технологийн зөвлөх болон дэмжлэг үзүүлэх үйлчилгээ
                </p>
              </div>
              
              <div className="service-item">
                <div className="service-bullet">•</div>
                <p className="service-text">
                  Байгууллагын дотоод гадаад сүлжээ, камер, холбоо дохиололын нэгдсэн систем, хяналтын үйлчилгээ
                </p>
              </div>
              
              <div className="service-item">
                <div className="service-bullet">•</div>
                <p className="service-text">
                  Байгууллагын МТ-ийн бүх төрлийн суурилуулалт хийх үйлчилгээ
                </p>
              </div>
              
              <div className="service-item">
                <div className="service-bullet">•</div>
                <p className="service-text">
                  Байгууллагын программ хангамж хөгжүүлэх үйлчилгээ
                </p>
              </div>
            </div>
            
            <p className="about-conclusion">
              хийж гүйцэтгэн ажиллаж байна.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

