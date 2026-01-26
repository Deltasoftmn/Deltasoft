import React from 'react';
import './Home.css';
import Hero from './Hero';
import Services from './Services';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Services />
    </div>
  );
};

export default Home;

