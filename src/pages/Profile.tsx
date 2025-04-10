import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { supabase } from '../services/supabase';
import styles from './Profile.module.css';

interface UserProfile {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  points: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const user = WebApp.initDataUnsafe.user;
      if (!user) {
        setError('Пользователь не авторизован');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setProfile({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          points: data.points,
        });
      }
    } catch (error) {
      setError('Ошибка при загрузке профиля');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Профиль не найден</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Профиль</h2>
        
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Имя:</span>
            <span className={styles.value}>
              {profile.first_name} {profile.last_name}
            </span>
          </div>
          
          {profile.username && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Username:</span>
              <span className={styles.value}>@{profile.username}</span>
            </div>
          )}
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Очки:</span>
            <span className={styles.points}>{profile.points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 