import apiService from './apiService';

class ContentService {
  // Получение контента для страницы (публичный)
  async getPageContent(page, section) {
    try {
      const endpoint = section ? `/content/${page}?section=${section}` : `/content/${page}`;
      const response = await apiService.get(endpoint);
      console.log('Content service response:', response);
      // Make sure we return an array of content sections
      return response.data && response.data.data ? response.data.data : [];
    } catch (error) {
      console.error('Error in getPageContent:', error);
      throw error;
    }
  }

  // Обновление контента страницы (админ)
  async updatePageContent(page, sectionData) {
    return apiService.put(`/admin/content/${page}`, sectionData, true);
  }

  // Удаление контента страницы (админ)
  async deletePageContent(page, section) {
    return apiService.delete(`/admin/content/${page}?section=${section}`, true);
  }
}

export default new ContentService(); 