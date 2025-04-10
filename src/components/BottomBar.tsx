import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BottomBar.module.css';

const BottomBar = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.bottomBar}>
      <button onClick={() => navigate('/')}>Элис</button>
      <button onClick={() => navigate('/profile')}>Профиль</button>
    </div>
  );
};

export default BottomBar; 