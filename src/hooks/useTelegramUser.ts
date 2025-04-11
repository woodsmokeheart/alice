import WebApp from '@twa-dev/sdk';

export const MOCK_USER = {
  id: 1036110525,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "ru"
};

export const useTelegramUser = () => {
  // В режиме разработки возвращаем тестового пользователя
  if (process.env.NODE_ENV === 'development') {
    return MOCK_USER;
  }
  
  // В продакшене возвращаем реального пользователя из Telegram
  return WebApp.initDataUnsafe.user;
}; 