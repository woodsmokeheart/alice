import WebApp from '@twa-dev/sdk';

export const MOCK_USER = {
  id: 1036110525,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "ru"
};

export const useTelegramUser = () => {
  // Для локальной разработки всегда возвращаем тестового пользователя
  return MOCK_USER;
}; 