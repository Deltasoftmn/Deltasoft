import React from 'react';
import BackButton from './BackButton';
import './WhyUs.css';

const WhyUs = () => {
  return (
    <div className="whyus-page">
      <div className="whyus-container" data-aos="fade-up">
        <BackButton />
        <h1 className="whyus-title">ЯГААД БИД ГЭЖ?</h1>
        <p className="whyus-text">
          Мэдээллийн технологийн эрин зуунд аливааа бизнесүүд IT-ийн оновчтой зөв шийдэлгүйгээр амжилттай урагшлах боломжгүй болсон.
          Бид таны хэрэгцээ шаардлагад нийцсэн <span className="highlight">ОРЧИН ҮЕИЙН ШИНЭЛЭГ ТЕХНОЛОГИ, ШИЙДЛИЙГ САНАЛ БОЛГОНО</span>.
          Ингэснээр та бизнесийнхээ үйл ажиллагаанд анхаарч IT-ийн оновчтой шийдлийг ашиглан амжилттай ажиллах үндэс суурь бий болно.
        </p>
      </div>
    </div>
  );
};

export default WhyUs;


