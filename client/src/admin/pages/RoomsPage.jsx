import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import roomService from '../services/roomService';
import './RoomsPage.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms();
      console.log('API response:', response);
      setRooms(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Ошибка загрузки комнат');
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await roomService.deleteRoom(deleteId);
      setRooms(rooms.filter(room => room.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.message || 'Ошибка удаления комнаты');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleStatusClick = (id) => {
    setStatusUpdateId(id);
    setShowStatusModal(true);
  };

  const updateRoomStatus = async (newStatus) => {
    if (!statusUpdateId) return;
    
    try {
      await roomService.updateRoom(statusUpdateId, { status: newStatus });
      
      // Обновляем список комнат с новым статусом
      setRooms(rooms.map(room => 
        room.id === statusUpdateId 
          ? { ...room, status: newStatus } 
          : room
      ));
      
      setShowStatusModal(false);
      setStatusUpdateId(null);
    } catch (err) {
      setError(err.message || 'Ошибка обновления статуса комнаты');
    }
  };

  const cancelStatusUpdate = () => {
    setShowStatusModal(false);
    setStatusUpdateId(null);
  };

  return (
    <AdminLayout title="Управление комнатами">
      <div className="rooms-container">
        <div className="rooms-header">
          <h2>Список комнат</h2>
          <Link to="/admin/rooms/new" className="add-room-button">
            <i className="fas fa-plus"></i> Добавить комнату
          </Link>
        </div>

        {loading ? (
          <div className="rooms-loading">Загрузка комнат...</div>
        ) : error ? (
          <div className="rooms-error">{error}</div>
        ) : rooms.length === 0 ? (
          <div className="rooms-empty">
            <p>Комнаты не найдены. Добавьте первую комнату!</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-image">
                  {room.images && room.images.length > 0 ? (
                    <>
                      <img
                        src={room.images[0].imageUrl}
                        alt={room.title}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.no-image').style.display = 'flex'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0', display: 'block' }}
                      />
                      <div className="no-image" style={{ display: 'none' }}>Нет изображения</div>
                    </>
                  ) : (
                    <div className="no-image">Нет изображения</div>
                  )}
                </div>
                <div className="room-info">
                  <h3>{room.title}</h3>
                  <p className="room-price">{room.price} ₽ / ночь</p>
                  <p className="room-capacity">
                    <i className="fas fa-user"></i> {room.capacity} гостей
                  </p>
                  <p className={`room-status status-${room.status}`}>
                    <i className="fas fa-circle"></i>
                    {room.status === 'available' ? 'Доступна' : 
                     room.status === 'occupied' ? 'Занята' : 
                     room.status === 'maintenance' ? 'На обслуживании' : room.status}
                  </p>
                </div>
                <div className="room-actions">
                  <button
                    className="status-button"
                    onClick={() => handleStatusClick(room.id)}
                    title="Изменить статус"
                  >
                    <i className="fas fa-exchange-alt"></i>
                  </button>
                  <Link to={`/admin/rooms/edit/${room.id}`} className="edit-button">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(room.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно подтверждения удаления */}
        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h3>Подтверждение удаления</h3>
              <p>Вы уверены, что хотите удалить эту комнату?</p>
              <p className="delete-warning">Это действие нельзя отменить.</p>
              <div className="delete-modal-actions">
                <button className="cancel-button" onClick={cancelDelete}>
                  Отмена
                </button>
                <button className="confirm-button" onClick={confirmDelete}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно изменения статуса */}
        {showStatusModal && (
          <div className="status-modal-overlay">
            <div className="status-modal">
              <h3>Изменить статус комнаты</h3>
              <p>Выберите новый статус для комнаты:</p>
              
              <div className="status-buttons">
                <button 
                  className="status-option status-available"
                  onClick={() => updateRoomStatus('available')}
                >
                  Доступна
                </button>
                <button 
                  className="status-option status-occupied"
                  onClick={() => updateRoomStatus('occupied')}
                >
                  Занята
                </button>
                <button 
                  className="status-option status-maintenance"
                  onClick={() => updateRoomStatus('maintenance')}
                >
                  На обслуживании
                </button>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-button"
                  onClick={cancelStatusUpdate}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RoomsPage; 