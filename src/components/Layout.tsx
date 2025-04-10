import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile';
import styles from './Layout.module.css';

const AliceChat = () => <div>Чат с Элис</div>;
const AdminPanel = () => <div>Админ панель</div>;

const BottomBar = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.bottomBar}>
      <button onClick={() => navigate('/chat')}>Элис</button>
      <button onClick={() => navigate('/profile')}>Профиль</button>
    </div>
  );
};

const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Routes>
          <Route path="/chat" element={<AliceChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </div>
      <BottomBar />
    </div>
  );
};

export default Layout; 