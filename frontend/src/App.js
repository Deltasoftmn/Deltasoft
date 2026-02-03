import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getStrapiJwt } from './api';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import WhyUs from './components/WhyUs';
import Works from './components/Works';
import Contact from './components/Contact';
import News from './components/News';
import Uilchilgee from './components/Uilchilgee';
import TonogTohooromj from './components/TonogTohooromj';
import VevDev from './components/VevDev';
import Delgets from './components/Delgets';
import AdminDashboard from './components/AdminDashboard';
import AdminRedirect from './components/AdminRedirect';

function AdminGuard({ children }) {
  return getStrapiJwt() ? children : <Navigate to="/admin" replace />;
}

function AppContent() {
  const location = useLocation();
  useEffect(() => {
    let obs = null;
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-aos]:not(.aos-animate)');
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('aos-animate');
              obs?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => obs.observe(el));
    }, 100);
    return () => {
      clearTimeout(t);
      obs?.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <Routes>
        <Route path="/admin" element={<AdminRedirect />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/*"
          element={
            <div className="main-layout">
              <Header />
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/why-us" element={<WhyUs />} />
                  <Route path="/works" element={<Works />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<News />} />
                  <Route path="/uilchilgee" element={<Uilchilgee />} />
                  <Route path="/tonog-tohooromj" element={<TonogTohooromj />} />
                  <Route path="/vev-dev" element={<VevDev />} />
                  <Route path="/delgets" element={<Delgets />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
