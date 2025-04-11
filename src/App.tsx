import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { initializeDevEnvironment } from './services/devService';
import styles from './App.module.css';

const App: React.FC = () => {
  useEffect(() => {
    // Инициализируем тестового пользователя в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      initializeDevEnvironment();
    }
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
