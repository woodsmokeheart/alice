import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomBar from './BottomBar';
import Profile from '../pages/Profile';
import styles from './Layout.module.css';

const AliceChat = () => <div>Чат с Элис</div>;
const AdminPanel = () => <div>Админ панель</div>;

const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<AliceChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomBar />
    </div>
  );
};

export default Layout; 