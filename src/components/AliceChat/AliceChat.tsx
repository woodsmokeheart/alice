import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useTelegramUser } from '../../hooks/useTelegramUser';
import { ChatProgress, getUserProgress, updateUserProgress } from '../../services/progressService';
import styles from './AliceChat.module.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGES = [
  { id: 1, text: 'Привет! Я Элис, хранительница этого мира. Рада тебя видеть!', isUser: false }
];

const AliceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const user = useTelegramUser();

  useEffect(() => {
    const initializeChat = async () => {
      if (!user?.id) return;

      const progress = await getUserProgress(user.id.toString());
      
      // Восстанавливаем состояние чата на основе прогресса
      switch (progress) {
        case ChatProgress.GREETED:
          setMessages([
            ...INITIAL_MESSAGES,
            { id: 2, text: 'Привет, что это за приложение?', isUser: true },
            { id: 3, text: 'Ты попал в мой волшебный мир историй! Здесь тебя ждут удивительные приключения и захватывающие путешествия.', isUser: false }
          ]);
          setCurrentStep(2);
          break;
        case ChatProgress.JOURNEY_STARTED:
        case ChatProgress.COMPLETED:
          setMessages([
            ...INITIAL_MESSAGES,
            { id: 2, text: 'Привет, что это за приложение?', isUser: true },
            { id: 3, text: 'Ты попал в мой волшебный мир историй! Здесь тебя ждут удивительные приключения и захватывающие путешествия.', isUser: false },
            { id: 4, text: 'Я готов начать путешествие!', isUser: true },
            { id: 5, text: 'Отлично! Я начислила тебе 1000 очков для старта. Теперь ты можешь исследовать этот мир и создавать свои истории!', isUser: false }
          ]);
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(1);
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [user?.id]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text, 
      isUser 
    }]);
  };

  const updateUserPoints = async (points: number) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('users')
        .update({ points })
        .eq('telegram_id', user.id.toString());

      if (error) throw error;
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const handleStep = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    switch (currentStep) {
      case 1:
        // Пользователь здоровается
        addMessage('Привет, что это за приложение?', true);
        
        // Задержка перед ответом Элис
        setTimeout(async () => {
          addMessage('Ты попал в мой волшебный мир историй! Здесь тебя ждут удивительные приключения и захватывающие путешествия.', false);
          await updateUserProgress(user.id.toString(), ChatProgress.GREETED);
          setCurrentStep(2);
          setIsLoading(false);
        }, 1000);
        break;

      case 2:
        // Проверяем, не получал ли пользователь уже очки
        const progress = await getUserProgress(user.id.toString());
        if (progress >= ChatProgress.JOURNEY_STARTED) {
          addMessage('Ты уже начал свое путешествие!', false);
          setIsLoading(false);
          return;
        }

        // Пользователь начинает путешествие
        addMessage('Я готов начать путешествие!', true);
        
        // Начисляем очки и отправляем сообщение
        setTimeout(async () => {
          const { data } = await supabase
            .from('users')
            .select('points')
            .eq('telegram_id', user.id.toString())
            .single();
          
          const currentPoints = data?.points || 0;
          await updateUserPoints(currentPoints + 1000);
          await updateUserProgress(user.id.toString(), ChatProgress.COMPLETED);
          
          addMessage('Отлично! Я начислила тебе 1000 очков для старта. Теперь ты можешь исследовать этот мир и создавать свои истории!', false);
          setCurrentStep(3);
          setIsLoading(false);
        }, 1000);
        break;
    }
  };

  const renderButton = () => {
    if (isLoading) return null;

    switch (currentStep) {
      case 1:
        return (
          <button 
            className={styles.actionButton} 
            onClick={() => handleStep()}
          >
            Поздороваться
          </button>
        );
      case 2:
        return (
          <button 
            className={styles.actionButton} 
            onClick={() => handleStep()}
          >
            Начать путешествие
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading && messages.length === INITIAL_MESSAGES.length) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`${styles.message} ${message.isUser ? styles.userMessage : styles.aliceMessage}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        {renderButton()}
      </div>
    </div>
  );
};

export default AliceChat; 