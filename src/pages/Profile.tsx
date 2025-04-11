import React from 'react';
import { useTelegramUser } from '../hooks/useTelegramUser';
import WebApp from '@twa-dev/sdk';
import styles from './Profile.module.css';

const BOT_USERNAME = 'Alicestory_bot';

const Profile: React.FC = () => {
  const { user, isLoading, error } = useTelegramUser();

  const handleInviteFriend = () => {
    // Создаем ссылку для шаринга бота
    const shareUrl = `https://t.me/share/url?url=https://t.me/${BOT_USERNAME}&text=Присоединяйся к волшебному миру историй!`;
    WebApp.openTelegramLink(shareUrl);
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>Пользователь не авторизован</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Профиль</h2>
        
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Имя:</span>
            <span className={styles.value}>
              {user.first_name} {user.last_name}
            </span>
          </div>
          
          {user.username && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Username:</span>
              <span className={styles.value}>@{user.username}</span>
            </div>
          )}
        </div>

        <button 
          className={styles.inviteButton}
          onClick={handleInviteFriend}
        >
          Пригласить друга
        </button>
      </div>
    </div>
  );
};

export default Profile; 