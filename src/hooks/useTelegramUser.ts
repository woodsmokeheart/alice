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

export const useTelegramUser = (): UserHookResult => {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstUser = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .single();
        
        if (dbError) {
          throw dbError;
        }

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

    // Если есть данные от Telegram - используем их
    const webAppUser = WebApp.initDataUnsafe?.user;
    if (webAppUser && Object.keys(webAppUser).length > 0) {
      setLocalUser({
        id: webAppUser.id,
        first_name: webAppUser.first_name || null,
        last_name: webAppUser.last_name || null,
        username: webAppUser.username || null,
        language_code: webAppUser.language_code
      });
      setIsLoading(false);
    } else {
      // Иначе получаем первого пользователя из базы
      fetchFirstUser();
    }
  }, []);

  return {
    user: localUser,
    isLoading,
    error
  };
}; 