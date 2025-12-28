// Конфигурация API
const API_CONFIG = {
  // Базовый URL API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  
  // Таймаут запроса (в миллисекундах)
  TIMEOUT: 15000,
  
  // Заголовки по умолчанию
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG; 