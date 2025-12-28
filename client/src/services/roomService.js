import axios from 'axios';
import API_CONFIG from '../config/api';

// Create an axios instance with settings
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Функция для обработки ответа сервера
const processResponse = (response) => {
  // Если это уже обработанный ответ в формате {success, data}
  if (response.data && response.data.hasOwnProperty('success')) {
    return response.data;
  }
  // Если данные непосредственно в data
  return {
    success: true,
    data: response.data
  };
};

class RoomService {
  // Get all available rooms
  async getAllAvailableRooms() {
    try {
      const response = await api.get('/rooms?status=available');
      return processResponse(response);
    } catch (error) {
      console.error('Error fetching available rooms:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }

  // Get room by ID
  async getRoomById(id) {
    try {
      const response = await api.get(`/rooms/${id}`);
      return processResponse(response);
    } catch (error) {
      console.error('Error fetching room:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }

  // Check room availability
  async checkAvailability(checkIn, checkOut, guests, roomType) {
    try {
      const response = await api.get(`/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&roomType=${roomType}`);
      return processResponse(response);
    } catch (error) {
      console.error('Error checking availability:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }
  
  // Get available additional services
  async getAdditionalServices() {
    try {
      const response = await api.get('/services');
      return processResponse(response);
    } catch (error) {
      console.error('Error fetching services:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }
}

export default new RoomService(); 