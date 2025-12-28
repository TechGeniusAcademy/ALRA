import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import bookingService from '../services/bookingService';
import roomService from '../services/roomService';
import './BookingDetailPage.css';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(id);
      setBooking(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка получения данных бронирования:', err);
      setError('Ошибка загрузки данных бронирования');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handleStatusChange = async (newStatus) => {
    try {
      await bookingService.updateBooking(id, { status: newStatus });
      
      // Если статус изменен на "confirmed" (подтверждено), обновляем статус комнаты на "occupied" (занято)
      if (newStatus === 'confirmed' && booking.room) {
        await roomService.updateRoom(booking.room.id, { status: 'occupied' });
      }
      
      // Если статус изменен на "cancelled" или "completed", возвращаем статус комнаты на "available" (доступно)
      if ((newStatus === 'cancelled' || newStatus === 'completed') && booking.room) {
        await roomService.updateRoom(booking.room.id, { status: 'available' });
      }
      
      // Обновляем данные бронирования
      fetchBookingDetails();
    } catch (err) {
      setError('Ошибка обновления статуса бронирования');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-badge status-pending';
      case 'confirmed': return 'status-badge status-confirmed';
      case 'cancelled': return 'status-badge status-cancelled';
      case 'completed': return 'status-badge status-completed';
      default: return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <AdminLayout title="Информация о бронировании">
        <div className="booking-detail-loading">Загрузка данных бронирования...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Информация о бронировании">
        <div className="booking-detail-error">{error}</div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout title="Информация о бронировании">
        <div className="booking-detail-error">Бронирование не найдено</div>
      </AdminLayout>
    );
  }

  // Расчет общей стоимости бронирования с учетом услуг
  const roomTotal = booking.calculatedTotal?.roomTotal || 0;
  const servicesTotal = booking.calculatedTotal?.servicesTotal || 0;
  const grandTotal = booking.calculatedTotal?.totalAmount || 0;
  const nights = booking.calculatedTotal?.nights || 0;

  return (
    <AdminLayout title="Информация о бронировании">
      <div className="booking-detail-container">
        <div className="booking-detail-header">
          <h2>Бронирование #{booking.id}</h2>
          <div className="booking-actions">
            <button 
              className="back-button"
              onClick={() => navigate('/admin/bookings')}
            >
              Назад к списку
            </button>
          </div>
        </div>

        <div className="booking-detail-status">
          <div className="current-status">
            <span>Текущий статус:</span>
            <span className={getStatusBadgeClass(booking.status)}>
              {getStatusText(booking.status)}
            </span>
          </div>
          
          <div className="status-actions">
            <h4>Изменить статус:</h4>
            <div className="status-buttons">
              <button 
                className="status-option status-pending"
                onClick={() => handleStatusChange('pending')}
                disabled={booking.status === 'pending'}
              >
                Ожидает
              </button>
              <button 
                className="status-option status-confirmed"
                onClick={() => handleStatusChange('confirmed')}
                disabled={booking.status === 'confirmed'}
              >
                Подтверждено
              </button>
              <button 
                className="status-option status-cancelled"
                onClick={() => handleStatusChange('cancelled')}
                disabled={booking.status === 'cancelled'}
              >
                Отменено
              </button>
              <button 
                className="status-option status-completed"
                onClick={() => handleStatusChange('completed')}
                disabled={booking.status === 'completed'}
              >
                Завершено
              </button>
            </div>
          </div>
        </div>
        
        <div className="booking-detail-content">
          <div className="booking-info-card guest-info">
            <h3>Информация о госте</h3>
            <div className="info-group">
              <label>Имя:</label>
              <span>{booking.clientName}</span>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <span>{booking.clientEmail}</span>
            </div>
            <div className="info-group">
              <label>Телефон:</label>
              <span>{booking.clientPhone}</span>
            </div>
            <div className="info-group">
              <label>Количество гостей:</label>
              <span>{booking.guests}</span>
            </div>
          </div>

          <div className="booking-info-card room-info">
            <h3>Информация о номере</h3>
            {booking.room ? (
              <>
                <div className="info-group">
                  <label>Номер:</label>
                  <span>{booking.room.title}</span>
                </div>
                <div className="info-group">
                  <label>Тип номера:</label>
                  <span>{booking.room.roomType === 'standard' ? 'Стандартный' : 
                         booking.room.roomType === 'lux' ? 'Люкс' : 
                         booking.room.roomType === 'family' ? 'Семейный' : 
                         booking.room.roomType}
                  </span>
                </div>
                <div className="info-group">
                  <label>Статус комнаты:</label>
                  <span>{booking.room.status === 'available' ? 'Доступна' : 
                         booking.room.status === 'occupied' ? 'Занята' : 
                         booking.room.status === 'maintenance' ? 'На обслуживании' : 
                         booking.room.status}
                  </span>
                </div>
                <div className="info-group">
                  <label>Вместимость:</label>
                  <span>{booking.room.capacity} чел.</span>
                </div>
                <div className="info-group">
                  <label>Цена за ночь:</label>
                  <span>{booking.room.price} ₽</span>
                </div>
              </>
            ) : (
              <p className="no-data">Информация о номере отсутствует</p>
            )}
          </div>

          <div className="booking-info-card dates-info">
            <h3>Даты бронирования</h3>
            <div className="info-group">
              <label>Заезд:</label>
              <span>{formatDate(booking.checkIn)}</span>
            </div>
            <div className="info-group">
              <label>Выезд:</label>
              <span>{formatDate(booking.checkOut)}</span>
            </div>
            <div className="info-group">
              <label>Количество ночей:</label>
              <span>{nights}</span>
            </div>
            <div className="info-group">
              <label>Дата создания бронирования:</label>
              <span>{formatDate(booking.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Блок с услугами если они есть */}
        {booking.services && booking.services.length > 0 && (
          <div className="booking-services">
            <h3>Дополнительные услуги</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Количество</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {booking.services.map(service => {
                  const quantity = service.bookingService ? service.bookingService.quantity : 1;
                  const price = service.bookingService ? service.bookingService.price : service.price;
                  return (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{quantity}</td>
                      <td>{price} ₽</td>
                      <td>{price * quantity} ₽</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Блок с общей суммой - отображается всегда */}
        <div className="booking-total-section">
          <h3>Итоговая стоимость</h3>
          <div className="total-details">
            <div className="total-row">
              <span>Проживание ({nights} ночей):</span>
              <span>{roomTotal} ₽</span>
            </div>
            {servicesTotal > 0 && (
              <div className="total-row">
                <span>Дополнительные услуги:</span>
                <span>{servicesTotal} ₽</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Итого:</span>
              <span>{grandTotal} ₽</span>
            </div>
          </div>
        </div>

        {/* Блок с примечаниями */}
        <div className="booking-notes">
          <h3>Примечания</h3>
          <p>{booking.notes || 'Нет примечаний'}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BookingDetailPage; 