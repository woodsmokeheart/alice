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
      // Получаем данные пользователя из Telegram WebApp
      const initData = WebApp.initData;
      console.log('Telegram WebApp initData:', initData);
      
      const user = WebApp.initDataUnsafe.user;
      console.log('Telegram user data:', user);

      if (!user || !user.id) {
        setError('Пользователь не авторизован в Telegram');
        setLoading(false);
        return;
      }

      // Проверяем, существует ли пользователь в базе
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', user.id.toString())
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        setError('Ошибка при загрузке профиля');
        setLoading(false);
        return;
      }

      if (!existingUser) {
        // Если пользователя нет, создаем новую запись
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              telegram_id: user.id.toString(),
              username: user.username || null,
              first_name: user.first_name || null,
              last_name: user.last_name || null,
              points: 0
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          setError('Ошибка при создании профиля');
          setLoading(false);
          return;
        }

        setProfile(newUser);
      } else {
        setProfile(existingUser);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Ошибка при загрузке профиля');
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