import React from 'react';
import BackButton from './BackButton';
import './About.css';

const INTRO_PARAGRAPHS = [
  'Дельтасофт компани нь 2020 онд үүсгэн байгуулагдсан бөгөөд түүнээс хойш мэдээллийн технологийн салбарт тогтвортой, тасралтгүй үйл ажиллагаа явуулж байна.',
  'Манай компани нь салбартаа олон жилийн ажлын дадлага, туршлагатай, мэргэшсэн инженер, мэргэжилтнүүдээс бүрдсэн чадварлаг багтайгаар программ хангамжийн хөгжүүлэлт, мэдээллийн технологийн шийдэл, системийн нэвтрүүлэлт, дэмжлэг үйлчилгээ үзүүлж ирсэн.',
  'Бид харилцагч байгууллагуудынхаа хэрэгцээ, шаардлагад нийц найдвартай, үр ашигтай шийдлийг санал болгохыг эрхэм зорилгоо болгож байна.',
];

const TEAM_DETAILED = [
  { name: 'Х.ӨНӨРБАЯН', title: 'Гүйцэтгэх захирал', image: '' },
  { name: 'С.НАНДИНХҮҮ', title: 'Ерөнхий инженер', image: '' },
  { name: 'Ц.БАЯРЖАРГАЛ', title: 'Ерөнхий менежер', image: '' },
  { name: 'О.ГАЛЧ', title: 'Системийн администратор' },
  { name: 'Н.ХУЛАН', title: 'Үйл ажиллагаа хариуцсан менежер', image: '' },
  { name: 'Б.МӨНХЦЭЦЭГ', title: 'Маркетинг менежер', image: '' },
];

const TEAM_COMPACT = [
  { name: 'Б.ЖАРГАЛСАЙХАН', title: 'Ахлах Хөгжүүлэгч' },
  { name: 'М.БИЛГҮҮНЗАЯА', title: 'Хөгжүүлэгч', image: '' },
  { name: 'Ө.ЭНХЖИН', title: 'Мэдээллийн аюулгүй байдлын мэргэжилтэн' },
  { name: 'У.АМГАЛАНБААТАР', title: 'Мэдээллийн аюулгүй байдлын инженер' },
];

const TEAM_ISOLATED = [
  { name: 'Д.ЭРДЭНЭХИШИГ', title: 'ІТ, камер хариуцсан инженер', image: '' },
  { name: 'Н.ДАГВАДОРЖ', title: 'IT, камер хариуцсан инженер', image: '' },
  { name: 'Х.АМАРСАНАА', title: 'ІТ инженер', image: '' },
  { name: 'Д.ИДЭРЗААН', title: 'ІТ инженер' },
];

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <BackButton />
        <h1 className="about-title">БИДНИЙ ТУХАЙ</h1>
        <div className="about-divider" />

        <section className="about-intro-block" data-aos="fade-up">
          <h2 className="about-intro-heading">КОМПАНИЙ ТАНИЛЦУУЛГА</h2>
          {INTRO_PARAGRAPHS.map((p, i) => (
            <p key={i} className="about-intro-text">{p}</p>
          ))}
        </section>

        <section className="about-team-section" data-aos="fade-up">
          <h2 className="about-team-heading">МАНАЙ ХАМТ ОЛОН</h2>

          <div className="team-detailed-grid">
            {TEAM_DETAILED.map((m, i) => (
              <div key={i} className={`team-card team-card-detailed ${!m.image ? 'team-card-no-photo' : ''}`}>
                {m.image && (
                  <div className="team-photo">
                    <img src={`${process.env.PUBLIC_URL || ''}/${m.image}`} alt={m.name} />
                  </div>
                )}
                <div className="team-info">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-title">{m.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="team-compact-grid">
            {TEAM_COMPACT.map((m, i) => (
              <div key={i} className={`team-card team-card-compact ${!m.image ? 'team-card-no-photo' : ''}`}>
                {m.image && (
                  <div className="team-photo team-photo-compact">
                    <img src={`${process.env.PUBLIC_URL || ''}/${m.image}`} alt={m.name} />
                  </div>
                )}
                <h3 className="team-name">{m.name}</h3>
                <div className="team-title-line" />
                <p className="team-title">{m.title}</p>
              </div>
            ))}
          </div>

          <div className="team-isolated-grid">
            {TEAM_ISOLATED.map((m, i) => (
              <div key={i} className={`team-card team-card-compact ${!m.image ? 'team-card-no-photo' : ''}`}>
                {m.image && (
                  <div className="team-photo team-photo-compact">
                    <img src={`${process.env.PUBLIC_URL || ''}/${m.image}`} alt={m.name} />
                  </div>
                )}
                <h3 className="team-name">{m.name}</h3>
                <div className="team-title-line" />
                <p className="team-title">{m.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
