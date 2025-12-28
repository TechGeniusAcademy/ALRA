import React, { useState } from 'react';
import bookingService from '../services/bookingService';
import './BookingForm.css';

const BookingForm = ({ room, checkIn, checkOut, guests, services, selectedServices, onBookingSuccess, onBookingError }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Подготовка данных для бронирования
    const bookingData = {
      roomId: room.id,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      checkIn,
      checkOut,
      guests,
      notes: formData.notes,
      services: selectedServices[room.id]?.map(serviceId => ({
        id: serviceId,
        quantity: 1
      })) || []
    };
    
    console.log('Booking room with ID:', room.id, 'Room details:', room);
    
    setLoading(true);
    setError(null);
    
    try {
      // Отправка запроса на бронирование
      const response = await bookingService.createBooking(bookingData);
      setLoading(false);
      
      // Успешное бронирование
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err) {
      setLoading(false);
      setError('Ошибка создания бронирования: ' + err);
      
      if (onBookingError) {
        onBookingError(err);
      }
    }
  };
  
  return (
    <div className="booking-form-container">
      <h3>Бронирование номера "{room.title}"</h3>
      
      {error && (
        <div className="booking-form-error">
          {error}
        </div>
      )}
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">Ваше имя *</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="clientEmail">Ваш Email *</label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="clientPhone">Номер телефона *</label>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Дополнительные пожелания</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="booking-submit-button"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Забронировать'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm; 