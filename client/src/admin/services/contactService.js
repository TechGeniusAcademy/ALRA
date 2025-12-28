import apiService from './apiService';

class ContactService {
  // Отправка контактной формы (публичный)
  async submitContactForm(contactData) {
    return apiService.post('/contact', contactData);
  }

  // Получение всех контактных сообщений (админ)
  async getAllContacts(status) {
    try {
      const endpoint = status ? `/admin/contacts?status=${status}` : '/admin/contacts';
      const response = await apiService.get(endpoint, true);
      console.log('Contact service response:', response);
      return response;
    } catch (error) {
      console.error('Error in getAllContacts:', error);
      throw error;
    }
  }

  // Получение контактного сообщения по ID (админ)
  async getContactById(id) {
    return apiService.get(`/admin/contacts/${id}`, true);
  }

  // Обновление статуса контактного сообщения (админ)
  async updateContact(id, contactData) {
    return apiService.put(`/admin/contacts/${id}`, contactData, true);
  }

  // Удаление контактного сообщения (админ)
  async deleteContact(id) {
    return apiService.delete(`/admin/contacts/${id}`, true);
  }
}

export default new ContactService(); 