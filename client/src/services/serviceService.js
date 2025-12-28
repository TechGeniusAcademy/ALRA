import axios from 'axios';
import API_CONFIG from '../config/api';

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

class ServiceService {
  // Получение всех услуг
  async getAllServices(onlyActive = true) {
    try {
      const endpoint = onlyActive ? '/services?active=true' : '/services';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }

  // Получение услуги по ID
  async getServiceById(id) {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }
}

export default new ServiceService(); 