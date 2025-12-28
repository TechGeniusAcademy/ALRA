import apiService from './apiService';

class RoomService {
  // Получение всех комнат
  async getAllRooms() {
    try {
      const response = await apiService.get('/rooms');
      console.log('Room service response:', response);
      return response;
    } catch (error) {
      console.error('Error in getAllRooms:', error);
      throw error;
    }
  }

  // Получение комнаты по ID
  async getRoomById(id) {
    return apiService.get(`/rooms/${id}`);
  }

  // Создание новой комнаты (админ)
  async createRoom(roomData) {
    // Ensure amenities is properly serialized as JSON
    if (roomData.amenities && Array.isArray(roomData.amenities)) {
      roomData.amenities = JSON.stringify(roomData.amenities);
    }
    return apiService.post('/rooms', roomData, true);
  }

  // Обновление комнаты (админ)
  async updateRoom(id, roomData) {
    // Ensure amenities is properly serialized as JSON
    if (roomData.amenities && Array.isArray(roomData.amenities)) {
      roomData.amenities = JSON.stringify(roomData.amenities);
    }
    return apiService.put(`/rooms/${id}`, roomData, true);
  }

  // Удаление комнаты (админ)
  async deleteRoom(id) {
    return apiService.delete(`/rooms/${id}`, true);
  }

  // Загрузка изображения для комнаты (админ)
  async uploadRoomImage(formData) {
    return apiService.post('/admin/uploads', formData, true, true);
  }

  // Удаление изображения комнаты (админ)
  async deleteRoomImage(imageId) {
    return apiService.delete(`/rooms/images/${imageId}`, true);
  }

  // Установка главного изображения комнаты (админ)
  async setMainRoomImage(roomId, imageId) {
    return apiService.put(`/rooms/${roomId}/images/${imageId}/main`, {}, true);
  }

  // Проверка доступности комнаты
  async checkAvailability(checkIn, checkOut, guests) {
    return apiService.get(`/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  }
}

export default new RoomService(); 