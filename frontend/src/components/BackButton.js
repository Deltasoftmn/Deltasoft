import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ to, label = '← Буцах', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      type="button"
      className={`back-button ${className}`.trim()}
      onClick={handleClick}
      aria-label="Буцах"
    >
      {label}
    </button>
  );
};

export default BackButton;
