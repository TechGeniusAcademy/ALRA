import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import bookingService from '../services/bookingService';
import './BookingsPage.css';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    fromDate: '',
    toDate: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings(filters);
      console.log('Bookings response:', response);
      setBookings(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Ошибка загрузки бронирований');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      fromDate: '',
      toDate: ''
    });
    // После сброса фильтров сразу загружаем все бронирования
    bookingService.getAllBookings().then(response => {
      setBookings(response.data || []);
    }).catch(err => {
      setError(err.message || 'Ошибка загрузки бронирований');
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'confirmed':
        return 'status-badge status-confirmed';
      case 'cancelled':
        return 'status-badge status-cancelled';
      case 'completed':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return 'Ожидает';
      case 'confirmed':
        return 'Подтверждено';
      case 'cancelled':
        return 'Отменено';
      case 'completed':
        return 'Завершено';
      default:
        return status;
    }
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const updateBookingStatus = async (newStatus) => {
    if (!selectedBooking) return;
    
    try {
      await bookingService.updateBooking(selectedBooking.id, { status: newStatus });
      
      // Обновляем список бронирований
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      
      setShowStatusModal(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message || 'Ошибка обновления статуса бронирования');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <AdminLayout title="Управление бронированиями">
      <div className="bookings-container">
        <div className="bookings-filters">
          <form onSubmit={applyFilters}>
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="status">Статус</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Все статусы</option>
                  <option value="pending">Ожидает</option>
                  <option value="confirmed">Подтверждено</option>
                  <option value="cancelled">Отменено</option>
                  <option value="completed">Завершено</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="fromDate">Дата от</label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="toDate">Дата до</label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="filter-actions">
                <button type="submit" className="apply-filters-button">
                  Применить
                </button>
                <button type="button" className="reset-filters-button" onClick={resetFilters}>
                  Сбросить
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="bookings-loading">Загрузка бронирований...</div>
        ) : error ? (
          <div className="bookings-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <p>Бронирования не найдены.</p>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Гость</th>
                  <th>Комната</th>
                  <th>Заезд</th>
                  <th>Выезд</th>
                  <th>Гостей</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>
                      <div className="guest-info">
                        <div>{booking.firstName} {booking.lastName}</div>
                        <div className="guest-email">{booking.email}</div>
                      </div>
                    </td>
                    <td>{booking.room?.title || 'N/A'}</td>
                    <td>{formatDate(booking.checkIn)}</td>
                    <td>{formatDate(booking.checkOut)}</td>
                    <td>{booking.guests}</td>
                    <td>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td>
                      <div className="booking-actions">
                        <button
                          className="status-button"
                          onClick={() => handleStatusChange(booking)}
                        >
                          <i className="fas fa-exchange-alt"></i>
                        </button>
                        <button
                          className="view-button"
                          onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Модальное окно изменения статуса */}
        {showStatusModal && selectedBooking && (
          <div className="status-modal-overlay">
            <div className="status-modal">
              <h3>Изменить статус бронирования</h3>
              <p>
                Бронирование №{selectedBooking.id} - {selectedBooking.firstName} {selectedBooking.lastName}
              </p>
              <p>Текущий статус: {getStatusText(selectedBooking.status)}</p>
              
              <div className="status-buttons">
                <button 
                  className="status-option status-pending"
                  onClick={() => updateBookingStatus('pending')}
                  disabled={selectedBooking.status === 'pending'}
                >
                  Ожидает
                </button>
                <button 
                  className="status-option status-confirmed"
                  onClick={() => updateBookingStatus('confirmed')}
                  disabled={selectedBooking.status === 'confirmed'}
                >
                  Подтверждено
                </button>
                <button 
                  className="status-option status-cancelled"
                  onClick={() => updateBookingStatus('cancelled')}
                  disabled={selectedBooking.status === 'cancelled'}
                >
                  Отменено
                </button>
                <button 
                  className="status-option status-completed"
                  onClick={() => updateBookingStatus('completed')}
                  disabled={selectedBooking.status === 'completed'}
                >
                  Завершено
                </button>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedBooking(null);
                  }}
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

export default BookingsPage; 