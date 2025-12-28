import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import RoomsPage from '../pages/RoomsPage';
import RoomFormPage from '../pages/RoomFormPage';
import BookingsPage from '../pages/BookingsPage';
import ContactsPage from '../pages/ContactsPage';
import ContentPage from '../pages/ContentPage';
import ServicesPage from '../pages/ServicesPage';
import ServiceFormPage from '../pages/ServiceFormPage';
import BookingDetailPage from '../pages/BookingDetailPage';

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/rooms" element={
        <ProtectedRoute>
          <RoomsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/rooms/new" element={
        <ProtectedRoute>
          <RoomFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/rooms/edit/:id" element={
        <ProtectedRoute>
          <RoomFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/bookings" element={
        <ProtectedRoute>
          <BookingsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/bookings/:id" element={
        <ProtectedRoute>
          <BookingDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/contacts" element={
        <ProtectedRoute>
          <ContactsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/content" element={
        <ProtectedRoute>
          <ContentPage />
        </ProtectedRoute>
      } />
      
      <Route path="/services" element={
        <ProtectedRoute>
          <ServicesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/services/new" element={
        <ProtectedRoute>
          <ServiceFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/services/edit/:id" element={
        <ProtectedRoute>
          <ServiceFormPage />
        </ProtectedRoute>
      } />
      
      {/* Перенаправление на дашборд по умолчанию для аутентифицированных пользователей */}
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      
      {/* Перенаправление всех других путей на дашборд */}
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
};

export default AdminRouter; 