import React from 'react';
import './Uilchilgee.css';

const Uilchilgee = () => {
  return (
    <div className="uilchilgee-page">
      <div className="uilchilgee-container">
        <h1 className="uilchilgee-title">ҮЙЛЧИЛГЭЭ</h1>
        <div className="uilchilgee-divider" />
        <p className="uilchilgee-subtitle">Гэрээт ІТ үйлчилгээ — МТ дэмжлэгийн багцууд</p>

        <div className="packages-grid" data-aos="stagger">
          {/* START IT SUPPORT */}
          <div className="package-card aos-stagger-item">
            <h2 className="package-title">START IT SUPPORT</h2>
            <p className="package-subtitle">СУУРЬ МТ ДЭМЖЛЭГИЙН БАГЦ<br />(Basic IT Support Package)</p>
            <ul className="package-list">
              <li>
                <strong>Техник хангамж, сүлжээ (Hardware, network):</strong>
                <span>Компьютер, принтер, сүлжээний суурь тохиргоо, засвар</span>
              </li>
              <li>
                <strong>Хэрэглээний программ хангамж (Application software):</strong>
                <span>Office, и-мэйл, нийтлэг программын дэмжлэг</span>
              </li>
              <li>
                <strong>Дата файл, нөөц бүрдүүлэлт (Data file, backup):</strong>
                <span>Суурь болон автомат нөөцлөлт (мэйл архив, файл архив гэх мэт)</span>
              </li>
              <li>
                <strong>Мониторинг (Monitoring):</strong>
                <span>Тоног төхөөрөмж, сүлжээний үндсэн хяналт</span>
              </li>
              <li>
                <strong>Сургалт, заавар зөвлөгөө (Training, instruction, advice):</strong>
                <span>Ажилтнуудад анхан шатны МТ зөвлөгөө</span>
              </li>
              <li>
                <strong>МТ-ийн хяналт тайлан (IT control report):</strong>
                <span>Сар тутмын тайлан</span>
              </li>
            </ul>
            <p className="package-summary">Жижиг, дунд байгууллагад өдөр тутмын МТ-ийн хэвийн ажиллагааг хангахад зориулагдсан.</p>
          </div>

          {/* PRO IT SUPPORT */}
          <div className="package-card package-card-pro aos-stagger-item">
            <h2 className="package-title">PRO IT SUPPORT</h2>
            <p className="package-subtitle">ӨРГӨТГӨСӨН МТ ДЭМЖЛЭГИЙН БАГЦ<br />(Extended IT Support Package)</p>
            <ul className="package-list">
              <li><strong>START IT SUPPORT</strong> багцын бүх үйлчилгээ</li>
              <li>
                <strong>Системийн тасралтгүй ажиллагаа (System uninterrupted operation):</strong>
                <span>Сервер, сүлжээ, программын найдвартай ажиллагаа</span>
              </li>
              <li>
                <strong>Мэдээллийн аюулгүй байдал (Information security):</strong>
                <span>Вирус, халдлагаас хамгаалах суурь шийдэл</span>
              </li>
              <li>
                <strong>Веб сайтын тасралтгүй ажиллагаа (Website uninterrupted operation):</strong>
                <span>Домэйн, хостинг, вебийн хяналт</span>
              </li>
              <li>
                <strong>Нэмэлт мониторинг (Additional monitoring):</strong>
                <span>Системийн алдааг урьдчилан илрүүлэх</span>
              </li>
              <li>
                <strong>Сургалт, зөвлөгөө (өргөтгөсөн):</strong>
                <span>МТ ашиглалтын анхан шатны сургалт, МАБ-ын анхан шатны сургалт</span>
              </li>
            </ul>
            <p className="package-summary">Өдөр тутмын ажиллагаанаас гадна МТ-ийн тогтвортой, аюулгүй байдлыг хангана.</p>
          </div>

          {/* PREMIUM IT SUPPORT */}
          <div className="package-card package-card-premium aos-stagger-item">
            <h2 className="package-title">PREMIUM IT SUPPORT</h2>
            <p className="package-subtitle">ИЖ БҮРЭН МТ УДИРДЛАГЫН БАГЦ<br />(Full IT Management Package)</p>
            <ul className="package-list">
              <li><strong>PRO IT SUPPORT</strong> багцын бүх үйлчилгээ</li>
              <li>
                <strong>Хяналтын камерын ажиллагаа (CCTV camera operation):</strong>
                <span>Камерын системийн хяналт, засвар үйлчилгээ</span>
              </li>
              <li>
                <strong>МТ төхөөрөмжийн нөөц төлөвлөлт (IT equipment resource planning):</strong>
                <span>Шинэчлэл, солих, хөрөнгө оруулалтын төлөвлөгөө</span>
              </li>
              <li>
                <strong>Салбар нэгжүүдийн МТ үзлэг (IT audit of branch units):</strong>
                <span>Олон салбартай байгууллагын нэгдсэн МТ хяналт</span>
              </li>
              <li>
                <strong>Нарийвчилсан мониторинг, тайлагнал (Detailed monitoring, reporting):</strong>
                <span>Удирдлагын түвшний тайлан, дүн шинжилгээ</span>
              </li>
              <li>
                <strong>МТ стратеги, зөвлөх үйлчилгээ (IT strategy, consulting service):</strong>
                <span>Урт хугацааны МТ хөгжлийн бодлого</span>
              </li>
              <li>
                <strong>Сургалт, зөвлөгөө (өргөтгөсөн):</strong>
                <span>МТ ашиглалтын анхан, дунд шатны сургалт; МАБ-ын анхан, дунд шатны сургалт</span>
              </li>
            </ul>
            <p className="package-summary">Байгууллагын МТ-ийг стратегийн түвшинд удирдаж, өндөр найдвартай ажиллагааг хангана.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uilchilgee;
