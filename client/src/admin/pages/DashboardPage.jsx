import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';
import contactService from '../services/contactService';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    rooms: 0,
    bookings: {
      total: 0,
      pending: 0,
      confirmed: 0
    },
    messages: {
      total: 0,
      unread: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Получаем все комнаты
        const roomsResponse = await roomService.getAllRooms();
        const roomsData = roomsResponse.data || [];
        
        // Получаем все бронирования
        const bookingsResponse = await bookingService.getAllBookings();
        const bookingsData = bookingsResponse.data || [];
        
        // Получаем все сообщения
        const contactsResponse = await contactService.getAllContacts();
        const contactsData = contactsResponse.data || [];
        
        // Подсчитываем статистику
        const pendingBookings = bookingsData.filter(booking => booking.status === 'pending');
        const confirmedBookings = bookingsData.filter(booking => booking.status === 'confirmed');
        const unreadMessages = contactsData.filter(message => message.status === 'unread');
        
        setStats({
          rooms: roomsData.length,
          bookings: {
            total: bookingsData.length,
            pending: pendingBookings.length,
            confirmed: confirmedBookings.length
          },
          messages: {
            total: contactsData.length,
            unread: unreadMessages.length
          }
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout title="Дашборд">
      <div className="dashboard-container">
        {loading ? (
          <div className="dashboard-loading">Загрузка данных...</div>
        ) : error ? (
          <div className="dashboard-error">{error}</div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-bed"></i>
                </div>
                <div className="stat-content">
                  <h3>Комнаты</h3>
                  <div className="stat-number">{stats.rooms}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <h3>Бронирования</h3>
                  <div className="stat-number">{stats.bookings.total}</div>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-clock"></i> Ожидают: {stats.bookings.pending}
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-check-circle"></i> Подтверждены: {stats.bookings.confirmed}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="stat-content">
                  <h3>Сообщения</h3>
                  <div className="stat-number">{stats.messages.total}</div>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-envelope-open"></i> Непрочитанные: {stats.messages.unread}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-actions">
              <div className="action-buttons">
                <a href="/admin/rooms/new" className="action-button">
                  <i className="fas fa-plus"></i> Добавить комнату
                </a>
                <a href="/admin/bookings" className="action-button">
                  <i className="fas fa-list"></i> Просмотреть бронирования
                </a>
                <a href="/admin/contacts" className="action-button">
                  <i className="fas fa-envelope-open-text"></i> Проверить сообщения
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage; 