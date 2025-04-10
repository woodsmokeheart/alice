import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztoybyylruoefhnlxcch.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b3lieXlscnVvZWZobmx4Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTIzNDgsImV4cCI6MjA1OTg2ODM0OH0.7d44zPNAmAJAW5ES9jqn3tMHeC-7gbdiRKScQfDvsa8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для работы с пользователями
export interface User {
  id: string;
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  points: number;
  created_at: string;
}

// Вспомогательные функции для работы с пользователями
export const userAPI = {
  // Создание или обновление пользователя
  upsertUser: async (userData: Omit<User, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        { 
          telegram_id: userData.telegram_id,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          points: userData.points
        },
        { onConflict: 'telegram_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Получение пользователя по telegram_id
  getUserByTelegramId: async (telegramId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление очков пользователя
  updateUserPoints: async (telegramId: string, points: number) => {
    const { data, error } = await supabase
      .from('users')
      .update({ points })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Получение всех пользователей (для админ-панели)
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('points', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Удаление пользователя (для админ-панели)
  deleteUser: async (telegramId: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('telegram_id', telegramId);

    if (error) throw error;
  }
}; 