import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Компонент для защиты административных маршрутов
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Перенаправление на страницу входа, если пользователь не авторизован
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 