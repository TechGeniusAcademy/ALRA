import React, { useState, useEffect } from 'react';
import './BookingModal.css';
import bookingService from '../services/bookingService';
import serviceService from '../services/serviceService';

const BookingModal = ({ isOpen, onClose, roomId, roomTitle, roomPrice }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [loadingServices, setLoadingServices] = useState(false);

  // Загрузка доступных услуг при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  // Получение списка услуг
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await serviceService.getAllServices(true);
      setServices(response.data || []);
      
      // Инициализируем объект выбранных услуг
      const initialSelectedServices = {};
      (response.data || []).forEach(service => {
        initialSelectedServices[service.id] = 0;
      });
      setSelectedServices(initialSelectedServices);
      
      setLoadingServices(false);
    } catch (error) {
      console.error('Ошибка при загрузке услуг:', error);
      setLoadingServices(false);
    }
  };

  // Получаем текущую дату в формате YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Получаем завтрашнюю дату в формате YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения количества выбранных услуг
  const handleServiceChange = (serviceId, quantity) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: quantity
    }));
  };

  // Расчет стоимости бронирования с учетом услуг
  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    // Базовая стоимость комнаты
    const startDate = new Date(formData.checkIn);
    const endDate = new Date(formData.checkOut);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const roomTotal = diffDays * roomPrice;
    
    // Стоимость дополнительных услуг
    const servicesTotal = services.reduce((total, service) => {
      const quantity = selectedServices[service.id] || 0;
      return total + (service.price * quantity);
    }, 0);
    
    return roomTotal + servicesTotal;
  };

  // Подготовка массива выбранных услуг для отправки на сервер
  const getSelectedServicesArray = () => {
    return Object.entries(selectedServices)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id: parseInt(id),
        quantity
      }));
  };

  // Проверка доступности при изменении дат
  useEffect(() => {
    const checkRoomAvailability = async () => {
      if (formData.checkIn && formData.checkOut) {
        try {
          const result = await bookingService.checkAvailability(roomId, formData.checkIn, formData.checkOut);
          if (!result.available) {
            setBookingError("Выбранные даты недоступны для бронирования. Пожалуйста, выберите другие даты.");
          } else {
            setBookingError(null);
          }
        } catch (error) {
          console.error("Ошибка при проверке доступности:", error);
        }
      }
    };

    // Добавляем небольшую задержку, чтобы не делать запрос при каждом нажатии клавиши
    const timeoutId = setTimeout(() => {
      checkRoomAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.checkIn, formData.checkOut, roomId]);

  // Отправка формы бронирования
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const bookingData = {
        roomId: roomId,
        clientName: `${formData.firstName} ${formData.lastName}`,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        notes: formData.notes,
        services: getSelectedServicesArray()
      };

      // Отправляем данные бронирования на сервер
      const response = await bookingService.createBooking(bookingData);
      console.log('Бронирование создано:', response);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Ошибка создания бронирования:', error);
      setBookingError(error.message || 'Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если модальное окно закрыто, не рендерим компонент
  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <button className="booking-modal-close" onClick={onClose}>×</button>
        
        {bookingSuccess ? (
          <div className="booking-success">
            <div className="booking-success-icon">✓</div>
            <h3>Спасибо за бронирование!</h3>
            <p>Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время для подтверждения.</p>
            <button className="booking-btn" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <>
            <h2 className="booking-modal-title">Забронировать номер</h2>
            {roomTitle && <h3 className="booking-modal-room-title">{roomTitle}</h3>}
            
            {bookingError && (
              <div className="booking-error">{bookingError}</div>
            )}
            
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label htmlFor="firstName">Имя *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="booking-form-group">
                  <label htmlFor="lastName">Фамилия *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="booking-form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label htmlFor="checkIn">Дата заезда *</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    required
                  />
                </div>
                
                <div className="booking-form-group">
                  <label htmlFor="checkOut">Дата выезда *</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    min={formData.checkIn || getTomorrowDate()}
                    required
                  />
                </div>
              </div>
              
              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label htmlFor="guests">Количество гостей *</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 гость</option>
                    <option value="2">2 гостя</option>
                    <option value="3">3 гостя</option>
                    <option value="4">4 гостя</option>
                  </select>
                </div>
              </div>
              
              <div className="booking-form-group">
                <label htmlFor="notes">Дополнительные пожелания</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              {/* Секция дополнительных услуг */}
              {services.length > 0 && (
                <div className="booking-services-section">
                  <h4 className="services-title">Дополнительные услуги</h4>
                  
                  <div className="services-list">
                    {loadingServices ? (
                      <div className="services-loading">Загрузка услуг...</div>
                    ) : (
                      services.map(service => (
                        <div key={service.id} className="service-item">
                          <div className="service-info">
                            <div className="service-name">{service.name}</div>
                            <div className="service-price">{service.price} ₽</div>
                            {service.description && (
                              <div className="service-description">{service.description}</div>
                            )}
                          </div>
                          
                          <div className="service-quantity">
                            <button 
                              type="button"
                              className="quantity-btn"
                              onClick={() => handleServiceChange(service.id, Math.max(0, (selectedServices[service.id] || 0) - 1))}
                              disabled={!selectedServices[service.id]}
                            >
                              −
                            </button>
                            <span className="quantity-value">{selectedServices[service.id] || 0}</span>
                            <button 
                              type="button"
                              className="quantity-btn"
                              onClick={() => handleServiceChange(service.id, (selectedServices[service.id] || 0) + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {formData.checkIn && formData.checkOut && (
                <div className="booking-total-price">
                  <p>Итоговая стоимость: <strong>{calculateTotalPrice()} ₽</strong></p>
                </div>
              )}
              
              <button 
                type="submit" 
                className="booking-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Забронировать'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal; 