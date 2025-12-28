import apiService from './apiService';

class ServiceService {
  // Get all services
  async getAllServices() {
    try {
      const response = await apiService.get('/services');
      return response;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }
  
  // Get service by ID
  async getServiceById(id) {
    try {
      const response = await apiService.get(`/services/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  }
  
  // Create a new service
  async createService(serviceData) {
    try {
      const response = await apiService.post('/services', serviceData, true);
      return response;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }
  
  // Update a service
  async updateService(id, serviceData) {
    try {
      const response = await apiService.put(`/services/${id}`, serviceData, true);
      return response;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }
  
  // Delete a service
  async deleteService(id) {
    try {
      const response = await apiService.delete(`/services/${id}`, true);
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}

export default new ServiceService(); 