import React from 'react';
import { Link } from 'react-router-dom';
import './VevDev.css';

const TECH_STACK = [
  {
    name: 'React',
    icon: '⚛️',
    desc: 'Орчин үеийн вэб апп, динамик интерфэйс, SPA хөгжүүлэлт. Хурдан, масштабдах боломжтой шийдэл.',
  },
  {
    name: 'Next.js',
    icon: '▲',
    desc: 'React дээр суурилсан SSR, статик сайт, API routes. SEO болон гүйцэтгэлд оновчтой.',
  },
  {
    name: 'WordPress',
    icon: '📝',
    desc: 'Контент удирдлага (CMS), блог, корпоратив вэб сайт. Засварлах амар, хэрэглэгчид ээлтэй.',
  },
  {
    name: 'Node.js',
    icon: '🟢',
    desc: 'JavaScript сервер талд ажиллуулах, real-time апп болон API хөгжүүлэх боломжтой runtime орчин.',
  },
  {
    name: 'AWS',
    icon: '☁️',
    desc: 'Cloud дээрх сервер, storage, database, deployment зэрэг дэд бүтцийг найдвартай, уян хатан шийдлээр хангана.',
  },
  {
    name: 'Django',
    icon: '🐍',
    desc: 'Python дээр суурилсан backend framework — хурдан 개발, найдвартай admin болон API хөгжүүлэлт.',
  },
  {
    name: 'MySQL',
    icon: '🐬',
    desc: 'Харилцан хамааралт өгөгдлийн бааз, бизнесийн өгөгдлийг найдвартай, бүтээмжтэй хадгална.',
  },
  {
    name: 'MongoDB',
    icon: '🍃',
    desc: 'NoSQL document database — уян хатан бүтэцтэй өгөгдөл, өндөр ачаалал даах чадвартай шийдэл.',
  },
];

const VevDev = () => {
  return (
    <div className="vev-dev-page">
      <div className="vev-dev-container">
        <h1 className="vev-dev-title">ВЭБ САЙТ, ПРОГРАМ ХАНГАМЖ ХӨГЖҮҮЛЭХ</h1>
        <div className="vev-dev-divider" />
        <p className="vev-dev-subtitle">Website & Software Development</p>

        <section className="vev-dev-intro" data-aos="fade-up">
          <p className="vev-dev-text">
            Манай баг React, Next.js, WordPress, Node.js, AWS, Django, MySQL, MongoDB зэрэг орчин үеийн
            технологи ашиглан вэб сайт, вэб апп, програм хангамжийн хөгжүүлэлтийг мэргэжлийн түвшинд гүйцэтгэнэ.
            Таны бизнесийн хэрэгцээнд нийцсэн хурдан, найдвартай, засварлах амар шийдэл санал болгоно.
          </p>
        </section>

        <section className="vev-dev-stack" data-aos="fade-up">
          <h2 className="vev-dev-section-title">Бидний ашигладаг технологи</h2>
          <div className="vev-dev-cards">
            {TECH_STACK.map((tech, i) => (
              <div key={tech.name} className="vev-dev-card aos-stagger-item" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="vev-dev-card-icon">{tech.icon}</div>
                <h3 className="vev-dev-card-title">{tech.name}</h3>
                <p className="vev-dev-card-desc">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="vev-dev-offer" data-aos="fade-up">
          <h2 className="vev-dev-section-title">Юу хөгжүүлдэг вэ?</h2>
          <ul className="vev-dev-list">
            <li>Вэб сайт (корпоратив, блог, дэлгүүр)</li>
            <li>Нэг хуудасны апп (SPA) — React, Next.js</li>
            <li>WordPress дээр суурилсан CMS сайт</li>
            <li>Тусгай програм хангамж, дотоод систем</li>
            <li>API холболт, интеграци</li>
          </ul>
        </section>

        <section className="vev-dev-cta" data-aos="fade-up">
          <p className="vev-dev-cta-text">Төслөө эхлүүлэх эсвэл үнийн санал авахыг хүсвэл холбогдоно уу.</p>
          <Link to="/contact" className="vev-dev-cta-btn">Холбоо барих</Link>
          <span className="vev-dev-cta-or">эсвэл</span>
          <Link to="/" className="vev-dev-cta-link">Үнийн санал авах</Link>
        </section>
      </div>
    </div>
  );
};

export default VevDev;
