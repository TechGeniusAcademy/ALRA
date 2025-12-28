import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { logout, currentAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <h2>ALRA Admin</h2>
        </div>
        {currentAdmin && (
          <div className="admin-user-info">
            <p>{currentAdmin.username}</p>
            <span>{currentAdmin.email}</span>
          </div>
        )}
      </div>

      <nav className="admin-nav">
        <ul>
          <li className={isActive('/admin/dashboard') ? 'active' : ''}>
            <Link to="/admin/dashboard">
              <i className="fas fa-tachometer-alt"></i> Дашборд
            </Link>
          </li>
          <li className={isActive('/admin/rooms') ? 'active' : ''}>
            <Link to="/admin/rooms">
              <i className="fas fa-bed"></i> Комнаты
            </Link>
          </li>
          <li className={isActive('/admin/bookings') ? 'active' : ''}>
            <Link to="/admin/bookings">
              <i className="fas fa-calendar-check"></i> Бронирования
            </Link>
          </li>
          <li className={isActive('/admin/contacts') ? 'active' : ''}>
            <Link to="/admin/contacts">
              <i className="fas fa-envelope"></i> Сообщения
            </Link>
          </li>
          <li className={isActive('/admin/services') ? 'active' : ''}>
            <Link to="/admin/services">
              <i className="fas fa-concierge-bell"></i> Услуги
            </Link>
          </li>
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={logout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i> Выход
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 