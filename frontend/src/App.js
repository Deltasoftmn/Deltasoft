import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Delgets from './components/Delgets';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/why-us" element={<WhyUs />} />
                  <Route path="/works" element={<Works />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/uilchilgee" element={<Uilchilgee />} />
                  <Route path="/delgets" element={<Delgets />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

