import WebApp from '@twa-dev/sdk';
import { supabase } from '../services/supabase';
import { useEffect, useState } from 'react';

// Интерфейс для пользователя
interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  language_code?: string;
}

interface UserHookResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const createOrUpdateUser = async (userData: User) => {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      telegram_id: userData.id.toString(),
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      points: 0,
      chat_progress: 0
    }, {
      onConflict: 'telegram_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useTelegramUser = (): UserHookResult => {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Проверяем данные из Telegram
        const webAppUser = WebApp.initDataUnsafe?.user;
        if (webAppUser && Object.keys(webAppUser).length > 0) {
          const userData: User = {
            id: webAppUser.id,
            first_name: webAppUser.first_name || null,
            last_name: webAppUser.last_name || null,
            username: webAppUser.username || null,
            language_code: webAppUser.language_code
          };
          
          // Создаем или обновляем пользователя в базе
          await createOrUpdateUser(userData);
          setLocalUser(userData);
          setIsLoading(false);
          return;
        }

        // Если нет данных Telegram, пробуем получить первого пользователя из базы
        const { data } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .single();
        
        if (data) {
          setLocalUser({
            id: parseInt(data.telegram_id),
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            language_code: 'ru'
          });
        } else {
          setError('Пользователь не найден в базе данных');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке пользователя');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return {
    user: localUser,
    isLoading,
    error
  };
}; 