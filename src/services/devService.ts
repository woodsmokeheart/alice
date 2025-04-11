import { supabase } from './supabase';
import { MOCK_USER } from '../hooks/useTelegramUser';

export const initializeDevEnvironment = async () => {
  try {
    // Проверяем, существует ли тестовый пользователь
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', MOCK_USER.id.toString())
      .maybeSingle();

    if (!existingUser) {
      // Создаем тестового пользователя
      await supabase
        .from('users')
        .insert([
          {
            telegram_id: MOCK_USER.id.toString(),
            username: MOCK_USER.username || null,
            first_name: MOCK_USER.first_name || null,
            last_name: MOCK_USER.last_name || null,
            points: 0,
            chat_progress: 0
          }
        ]);
    }
  } catch (error) {
    console.error('Error initializing dev environment:', error);
  }
}; 