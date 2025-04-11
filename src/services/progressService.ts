import { supabase } from './supabase';

export enum ChatProgress {
  NOT_STARTED = 0,
  GREETED = 1,
  JOURNEY_STARTED = 2,
  COMPLETED = 3
}

export const getUserProgress = async (telegramId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('chat_progress')
      .eq('telegram_id', telegramId)
      .single();

    if (error) throw error;
    return data?.chat_progress || ChatProgress.NOT_STARTED;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return ChatProgress.NOT_STARTED;
  }
};

export const updateUserProgress = async (telegramId: string, progress: ChatProgress) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ chat_progress: progress })
      .eq('telegram_id', telegramId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
}; 