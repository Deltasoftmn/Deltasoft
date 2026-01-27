import React from 'react';
import './About.css';

const INTRO_PARAGRAPHS = [
  'Дельтасофт компани нь 2020 онд үүсгэн байгуулагдсан бөгөөд түүнээс хойш мэдээллийн технологийн салбарт тогтвортой, тасралтгүй үйл ажиллагаа явуулж байна.',
  'Манай компани нь салбартаа олон жилийн ажлын дадлага, туршлагатай, мэргэшсэн инженер, мэргэжилтнүүдээс бүрдсэн чадварлаг багтайгаар программ хангамжийн хөгжүүлэлт, мэдээллийн технологийн шийдэл, системийн нэвтрүүлэлт, дэмжлэг үйлчилгээ үзүүлж ирсэн.',
  'Бид харилцагч байгууллагуудынхаа хэрэгцээ, шаардлагад нийц найдвартай, үр ашигтай шийдлийг санал болгохыг эрхэм зорилгоо болгож байна.',
];

const TEAM_DETAILED = [
  { name: 'Х.ӨНӨРБАЯН', title: 'Гүйцэтгэх захирал', profession: 'Сүлжээний Дэд Бүтцийн инженер', jobs: ['2020-оноос: "Дельтасофт" ХХК', '2018-2020: "Таванбогд" Групп', '2012-2018: "Кевико" XXK'], years: '13+' },
  { name: 'С.НАНДИНХҮҮ', title: 'Ерөнхий инженер', profession: 'ІТ инженер', jobs: ['2023-оноос: "Дельтасофт" ХХК', '2019-2023: NUBIA /Шинэ нисэх буудал/', '2010-2019: Чингис хаан ОУНБ', '2005-2007: USI программын компани'], years: '20+' },
  { name: 'Ц.БАЯРЖАРГАЛ', title: 'Ерөнхий менежер', profession: 'Сүлжээний Дэд Бүтцийн инженер', jobs: ['2024-оноос: "Дельтасофт" ХХК', '2023-2024: Хаанбанк', '2022-2023: "Монполимет" Групп', '2018-2021: "Таван Богд" Групп', '2014-2018: "Бон интернейшнл"'], years: '11+' },
  { name: 'О.ГАЛЧ', title: 'Системийн администратор', profession: 'Системийн инженер', jobs: ['2022-оноос: "Дельтасофт" ХХК', '2018-2022: "Таван Богд" Групп', '2014-2018: "Алтан Жолоо" Групп', '2007-2014: "Монос Групп"'], years: '18+' },
  { name: 'Н.ХУЛАН', title: 'Үйл ажиллагаа хариуцсан менежер', profession: 'Борлуулалтын менежер, ІТ инженер', jobs: ['2025-оноос: "Дельтасофт" ХХК', '2025/02-07: "Могул сервис" ХХК', '2022-2025: Caffe Bene Mongolia'], years: '3+' },
];

const TEAM_COMPACT = [
  { name: 'У.АМГАЛАНБААТАР', title: 'Мэдээллийн аюулгүй байдлын инженер', years: '9+' },
  { name: 'Х.АМАРСАНАА', title: 'ІТ инженер', years: '3+' },
  { name: 'Д.ИДЭРЗААН', title: 'ІТ инженер', years: '4+' },
  { name: 'Д.ЭРДЭНЭХИШИГ', title: 'ІТ, камер хариуцсан инженер', years: '3+' },
  { name: 'Н.ДАГВАДОРЖ', title: 'IT, камер хариуцсан инженер', years: '2+' },
  { name: 'М.БИЛГҮҮНЗАЯА', title: 'Хөгжүүлэгч', years: '1+' },
];

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
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
              <div key={i} className="team-card team-card-detailed">
                <div className="team-photo" />
                <div className="team-info">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-title">{m.title}</p>
                  <p className="team-profession">{m.profession}</p>
                  <ul className="team-jobs">
                    {m.jobs.map((j, jj) => (
                      <li key={jj}>{j}</li>
                    ))}
                  </ul>
                  <p className="team-years">{m.years} жилийн ажлын туршлагатай</p>
                </div>
              </div>
            ))}
          </div>

          <div className="team-compact-grid">
            {TEAM_COMPACT.map((m, i) => (
              <div key={i} className="team-card team-card-compact">
                <div className="team-photo team-photo-compact" />
                <h3 className="team-name">{m.name}</h3>
                <div className="team-title-line" />
                <p className="team-title">{m.title}</p>
                <p className="team-years">{m.years} жилийн ажлын туршлагатай</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
