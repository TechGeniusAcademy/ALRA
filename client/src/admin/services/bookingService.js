import apiService from './apiService';

class BookingService {
  // Создание нового бронирования (публичный)
  async createBooking(bookingData) {
    return apiService.post('/bookings', bookingData);
  }

  // Получение всех бронирований (админ)
  async getAllBookings(filters = {}) {
    try {
      let queryParams = '';
      
      if (filters.status) {
        queryParams += `status=${filters.status}&`;
      }
      
      if (filters.fromDate) {
        queryParams += `fromDate=${filters.fromDate}&`;
      }
      
      if (filters.toDate) {
        queryParams += `toDate=${filters.toDate}&`;
      }
      
      // Удаление последнего символа '&' если он есть
      if (queryParams.endsWith('&')) {
        queryParams = queryParams.slice(0, -1);
      }
      
      const endpoint = queryParams ? `/admin/bookings?${queryParams}` : '/admin/bookings';
      const response = await apiService.get(endpoint, true);
      console.log('Booking service response:', response);
      return response;
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      throw error;
    }
  }

  // Получение бронирования по ID (админ)
  async getBookingById(id) {
    return apiService.get(`/admin/bookings/${id}`, true);
  }

  // Обновление статуса бронирования (админ)
  async updateBooking(id, bookingData) {
    return apiService.put(`/admin/bookings/${id}`, bookingData, true);
  }

  // Удаление бронирования (админ)
  async deleteBooking(id) {
    return apiService.delete(`/admin/bookings/${id}`, true);
  }
}

export default new BookingService(); 