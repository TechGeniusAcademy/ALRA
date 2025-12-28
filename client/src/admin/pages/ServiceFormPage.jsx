import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import serviceService from '../services/serviceService';
import './ServiceFormPage.css';

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    active: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Загрузка данных услуги при редактировании
  useEffect(() => {
    if (isEditMode) {
      fetchServiceData();
    }
  }, [id]);
  
  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getServiceById(id);
      if (response.data) {
        const serviceData = response.data;
        
        // Устанавливаем данные формы
        setFormData({
          name: serviceData.name || '',
          description: serviceData.description || '',
          price: serviceData.price || '',
          active: serviceData.active ?? true
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError('Ошибка загрузки данных услуги');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Валидация формы
      if (!formData.name || !formData.price) {
        setError('Пожалуйста, заполните все обязательные поля');
        setSaving(false);
        return;
      }
      
      // Создание объекта с данными услуги
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // Отправка данных на сервер
      if (isEditMode) {
        // Обновление существующей услуги
        await serviceService.updateService(id, serviceData);
      } else {
        // Создание новой услуги
        await serviceService.createService(serviceData);
      }
      
      // Перенаправление на страницу услуг
      navigate('/admin/services');
      
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.message || 'Ошибка сохранения услуги');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title={isEditMode ? "Редактирование услуги" : "Добавление услуги"}>
        <div className="service-form-loading">Загрузка данных...</div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditMode ? "Редактирование услуги" : "Добавление услуги"}>
      <div className="service-form-container">
        {error && (
          <div className="service-form-error">{error}</div>
        )}
        
        <form className="service-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Название услуги *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Цена (₽) *</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
            />
            <label htmlFor="active">Активна</label>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/admin/services')}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : (isEditMode ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ServiceFormPage; 