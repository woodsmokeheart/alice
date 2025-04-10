import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import WebApp from '@twa-dev/sdk';
import Layout from './components/Layout';
import styles from './App.module.css';
import { initializeUser } from './services/userService';

// Временные компоненты-заглушки
const MobileOnly = () => (
  <div className={styles.mobileOnly}>
    <h1>Мобильная версия</h1>
    <p>Пожалуйста, откройте приложение на мобильном устройстве</p>
  </div>
);

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        WebApp.ready();
        await initializeUser();
        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Ошибка инициализации приложения');
      }
    };

    init();
  }, []);

  // Проверка на мобильное устройство
  if (!isMobile) {
    return <MobileOnly />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!isInitialized) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
