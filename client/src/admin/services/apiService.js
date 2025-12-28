import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Базовый класс для работы с API
class ApiService {
  // Метод для выполнения GET запросов
  async get(endpoint, isProtected = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Добавление токена для защищенных запросов
      if (isProtected) {
        headers['Authorization'] = `Bearer ${authService.getToken()}`;
        if (!authService.isAuthenticated()) {
          throw new Error('Необходима авторизация');
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
      }

      return data;
    } catch (error) {
      console.error(`Ошибка GET запроса к ${endpoint}:`, error);
      throw error;
    }
  }

  // Метод для выполнения POST запросов
  async post(endpoint, body, isProtected = false, isFormData = false) {
    try {
      let headers = {};
      
      // Если не FormData, устанавливаем заголовок Content-Type
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // Добавление токена для защищенных запросов
      if (isProtected) {
        headers['Authorization'] = `Bearer ${authService.getToken()}`;
        if (!authService.isAuthenticated()) {
          throw new Error('Необходима авторизация');
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
      }

      return data;
    } catch (error) {
      console.error(`Ошибка POST запроса к ${endpoint}:`, error);
      throw error;
    }
  }

  // Метод для выполнения PUT запросов
  async put(endpoint, body, isProtected = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Добавление токена для защищенных запросов
      if (isProtected) {
        headers['Authorization'] = `Bearer ${authService.getToken()}`;
        if (!authService.isAuthenticated()) {
          throw new Error('Необходима авторизация');
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
      }

      return data;
    } catch (error) {
      console.error(`Ошибка PUT запроса к ${endpoint}:`, error);
      throw error;
    }
  }

  // Метод для выполнения DELETE запросов
  async delete(endpoint, isProtected = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Добавление токена для защищенных запросов
      if (isProtected) {
        headers['Authorization'] = `Bearer ${authService.getToken()}`;
        if (!authService.isAuthenticated()) {
          throw new Error('Необходима авторизация');
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
      }

      return data;
    } catch (error) {
      console.error(`Ошибка DELETE запроса к ${endpoint}:`, error);
      throw error;
    }
  }

  // Метод для загрузки файлов (используйте post с isFormData=true вместо этого метода)
  async uploadFile(file, isProtected = true) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const headers = {};

      // Добавление токена для защищенных запросов
      if (isProtected) {
        headers['Authorization'] = `Bearer ${authService.getToken()}`;
        if (!authService.isAuthenticated()) {
          throw new Error('Необходима авторизация');
        }
      }

      const response = await fetch(`${API_URL}/admin/uploads`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка загрузки файла');
      }

      return data;
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      throw error;
    }
  }
}

export default new ApiService(); 