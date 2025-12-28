import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import serviceService from '../services/serviceService';
import './ServicesPage.css';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Загрузка всех услуг при монтировании компонента
  useEffect(() => {
    fetchServices();
  }, []);

  // Функция загрузки услуг
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAllServices();
      setServices(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Ошибка загрузки услуг');
      setLoading(false);
    }
  };

  // Открытие диалога подтверждения удаления
  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowConfirmation(true);
  };

  // Закрытие диалога подтверждения
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setServiceToDelete(null);
  };

  // Удаление услуги
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await serviceService.deleteService(serviceToDelete.id);
      
      // Обновляем список услуг после удаления
      setServices(services.filter(service => service.id !== serviceToDelete.id));
      
      // Закрываем диалог
      setShowConfirmation(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Ошибка удаления услуги');
      
      // Закрываем диалог даже при ошибке
      setShowConfirmation(false);
      setServiceToDelete(null);
    }
  };

  return (
    <AdminLayout title="Дополнительные услуги">
      <div className="admin-services-container">
        <div className="admin-services-header">
          <h1>Дополнительные услуги</h1>
          <Link to="/admin/services/new" className="add-service-button">
            Добавить услугу
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">Загрузка услуг...</div>
        ) : services.length === 0 ? (
          <div className="empty-message">
            <p>Нет доступных услуг.</p>
            <p>Нажмите "Добавить услугу", чтобы создать новую услугу.</p>
          </div>
        ) : (
          <div className="services-table-container">
            <table className="services-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Цена (₽)</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.description}</td>
                    <td>{service.price}</td>
                    <td className="actions-cell">
                      <Link to={`/admin/services/edit/${service.id}`} className="edit-button">
                        
                      </Link>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(service)}
                      >
                        
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Диалог подтверждения удаления */}
        {showConfirmation && (
          <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
              <h3>Подтверждение удаления</h3>
              <p>Вы действительно хотите удалить услугу "{serviceToDelete?.name}"?</p>
              <div className="confirmation-actions">
                <button className="cancel-button" onClick={handleCancelDelete}>Отмена</button>
                <button className="confirm-button" onClick={handleConfirmDelete}>Удалить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServicesPage; 