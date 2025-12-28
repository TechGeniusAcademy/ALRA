import axios from 'axios';
import API_CONFIG from '../config/api';

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

class BookingService {
  // Создание нового бронирования
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }

  // Проверка доступности комнаты
  async checkAvailability(roomId, checkIn, checkOut) {
    try {
      const response = await api.get(
        `/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
      );
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }

  // Получение информации о бронировании по ID
  async getBookingById(bookingId) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error.response?.data || error.message);
      throw error.response?.data?.message || error.response?.data || error.message;
    }
  }
}

export default new BookingService(); 