// Сервис для работы с аутентификацией
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class AuthService {
  // Вход администратора
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа');
      }

      // Сохранение токена в localStorage
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('admin', JSON.stringify(data.administrator));
      }

      return data;
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  }

  // Выход администратора
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }

  // Получение токена
  getToken() {
    return localStorage.getItem('token');
  }

  // Проверка авторизации администратора
  isAuthenticated() {
    return !!this.getToken();
  }

  // Получение информации о текущем администраторе
  async getCurrentAdmin() {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка получения информации о пользователе');
      }

      return data.administrator;
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      this.logout(); // Выход при ошибке получения информации
      throw error;
    }
  }
}

export default new AuthService(); 