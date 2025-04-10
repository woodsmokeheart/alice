import WebApp from '@twa-dev/sdk';
import { supabase } from './supabase';

export const initializeUser = async () => {
  try {
    const user = WebApp.initDataUnsafe.user;
    
    if (!user || !user.id) {
      throw new Error('Пользователь не авторизован в Telegram');
    }

    // Проверяем существование пользователя
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', user.id.toString())
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingUser) {
      // Создаем нового пользователя
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
        throw createError;
      }

      return newUser;
    }

    return existingUser;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}; 