import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import WebApp from '@twa-dev/sdk';
import Layout from './components/Layout';
import styles from './App.module.css';

// Временные компоненты-заглушки
const MobileOnly = () => (
  <div className={styles.mobileOnly}>
    <h1>Мобильная версия</h1>
    <p>Пожалуйста, откройте приложение на мобильном устройстве</p>
  </div>
);

const App: React.FC = () => {
  React.useEffect(() => {
    // Инициализация Telegram Web App
    WebApp.ready();
  }, []);

  // Проверка на мобильное устройство
  if (!isMobile) {
    return <MobileOnly />;
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
