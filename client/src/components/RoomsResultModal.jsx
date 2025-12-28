import React, { useState, useEffect } from 'react';
import './RoomsResultModal.css';
import roomService from '../services/roomService';
import BookingForm from './BookingForm';
import { useBooking } from '../contexts/BookingContext';

const RoomsResultModal = ({ isOpen, onClose, rooms, checkIn, checkOut, guests }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState({}); // State для отображения формы бронирования
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Используем контекст бронирования
  const { openBookingModal } = useBooking();
  
  // Логирование данных о комнатах для отладки
  useEffect(() => {
    if (isOpen && rooms && rooms.length > 0) {
      console.log('Данные о комнатах:', rooms);
      console.log('Первая комната:', rooms[0]);
    }
  }, [isOpen, rooms]);
  
  // Расчет количества ночей
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };
  
  // Получение доступных дополнительных услуг
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await roomService.getAdditionalServices();
        // Проверяем структуру ответа и преобразуем данные при необходимости
        let servicesList = [];
        if (response && response.data) {
          servicesList = response.data;
        } else if (Array.isArray(response)) {
          servicesList = response;
        }
        setServices(servicesList || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchServices();
      // Инициализируем выбранные услуги для каждой комнаты
      const initialSelectedServices = {};
      const initialShowForm = {};
      rooms.forEach(room => {
        initialSelectedServices[room.id] = [];
        initialShowForm[room.id] = false;
      });
      setSelectedServices(initialSelectedServices);
      setShowForm(initialShowForm);
      setBookingSuccess(false);
      setSuccessMessage('');
    }
  }, [isOpen, rooms]);
  
  // Обработчик выбора дополнительной услуги
  const handleServiceSelect = (roomId, serviceId, isChecked) => {
    setSelectedServices(prev => {
      const updatedServices = { ...prev };
      
      if (isChecked) {
        // Добавляем услугу, если она еще не выбрана
        if (!updatedServices[roomId].includes(serviceId)) {
          updatedServices[roomId] = [...updatedServices[roomId], serviceId];
        }
      } else {
        // Удаляем услугу из выбранных
        updatedServices[roomId] = updatedServices[roomId].filter(id => id !== serviceId);
      }
      
      return updatedServices;
    });
  };
  
  // Расчет общей стоимости бронирования (комната + услуги)
  const calculateTotalPrice = (room) => {
    const nights = calculateNights();
    let total = room.price * nights; // Стоимость комнаты
    
    // Добавляем стоимость выбранных услуг
    if (selectedServices[room.id]?.length > 0) {
      selectedServices[room.id].forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          total += service.price;
        }
      });
    }
    
    return total;
  };
  
  // Формирование текста для отправки в WhatsApp
  const generateBookingMessage = (room) => {
    const nights = calculateNights();
    let message = `Здравствуйте! Хочу забронировать номер в ALRA Eco Village:\n\n`;
    message += `Номер: ${room.title}\n`;
    message += `Даты: ${formatDate(checkIn)} - ${formatDate(checkOut)} (${nights} ночей)\n`;
    message += `Количество гостей: ${guests}\n\n`;
    
    // Добавляем выбранные услуги
    if (selectedServices[room.id]?.length > 0) {
      message += `Дополнительные услуги:\n`;
      selectedServices[room.id].forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          message += `- ${service.name} (${service.price} ₽)\n`;
        }
      });
      message += `\n`;
    }
    
    // Итоговая стоимость
    message += `Итоговая сумма: ${calculateTotalPrice(room)} ₽\n\n`;
    message += `Прошу подтвердить бронирование.`;
    
    return encodeURIComponent(message);
  };
  
  // Форматирование даты в читаемый формат
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Обработчик кнопки "Забронировать через WhatsApp"
  const handleBookWhatsApp = (room) => {
    const message = generateBookingMessage(room);
    window.open(`https://wa.me/79407179988?text=${message}`, '_blank');
  };
  
  // Обработчик кнопки "Забронировать онлайн"
  const handleBookOnline = (room) => {
    // Открываем глобальное модальное окно бронирования с выбранной комнатой
    openBookingModal(room);
    // Закрываем текущее модальное окно
    onClose();
  };
  
  // Обработчик успешного бронирования
  const handleBookingSuccess = (bookingData) => {
    setBookingSuccess(true);
    setSuccessMessage(`Бронирование успешно создано! Мы свяжемся с вами в ближайшее время для подтверждения.`);
    // Скрываем форму бронирования
    setShowForm({});
  };
  
  // Обработчик ошибки бронирования
  const handleBookingError = (error) => {
    console.error('Booking error:', error);
  };
  
  // Проверка, является ли amenities массивом
  const getAmenities = (amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === 'string') {
      try {
        // Пробуем распарсить строку, если это JSON
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // Если не получилось распарсить, возвращаем пустой массив
        return [];
      }
    }
    return [];
  };
  
  // Добавим функцию для получения главного изображения
  const getMainImage = (room) => {
    if (!room) return null;
    
    // Если у комнаты есть массив изображений, ищем главное
    if (room.images && Array.isArray(room.images)) {
      const mainImage = room.images.find(img => img.isMain);
      if (mainImage) return mainImage.imageUrl;
      // Если нет главного, берем первое
      if (room.images.length > 0) return room.images[0].imageUrl;
    }
    
    // Если есть прямая ссылка на изображение
    if (room.imageUrl) return room.imageUrl;
    
    // По умолчанию заглушка
    return 'https://i.postimg.cc/B6Q5ym4s/Frame-1499.png';
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="rooms-result-modal-overlay">
      <div className="rooms-result-modal">
        <div className="rooms-result-modal-header">
          <h2>Доступные номера</h2>
          <button className="rooms-result-close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="rooms-result-modal-content">
          {bookingSuccess && (
            <div className="booking-success-message">
              {successMessage}
              <button className="close-success-button" onClick={() => onClose()}>Закрыть</button>
            </div>
          )}
          
          {!bookingSuccess && rooms.length === 0 ? (
            <div className="rooms-result-empty">
              <p>К сожалению, на выбранные даты нет доступных номеров указанного типа.</p>
              <p>Пожалуйста, выберите другие даты или тип номера.</p>
            </div>
          ) : !bookingSuccess && (
            <div className="rooms-result-cards">
              {rooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-card-image">
                    <img src={getMainImage(room)} alt={room.title} />
                  </div>
                  
                  <div className="room-card-content">
                    <h3 className="room-card-title">{room.title}</h3>
                    <p className="room-card-description">{room.description}</p>
                    
                    <div className="room-card-amenities">
                      <h4>Удобства:</h4>
                      <ul>
                        {getAmenities(room.amenities).map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="room-card-price">
                      <span className="price-value">{room.price} ₽</span>
                      <span className="price-night">/ ночь</span>
                    </div>
                    
                    <div className="room-card-services">
                      <h4>Дополнительные услуги:</h4>
                      
                      {loading ? (
                        <p>Загрузка услуг...</p>
                      ) : services.length === 0 ? (
                        <p>Нет доступных дополнительных услуг</p>
                      ) : (
                        <div className="services-list">
                          {services.map(service => (
                            <div key={service.id} className="service-item">
                              <label className="service-checkbox">
                                <input 
                                  type="checkbox"
                                  onChange={(e) => handleServiceSelect(room.id, service.id, e.target.checked)}
                                  checked={selectedServices[room.id]?.includes(service.id) || false}
                                />
                                <span className="service-title">{service.name}</span>
                                <span className="service-price">+{service.price} ₽</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="room-card-total">
                      <div className="total-info">
                        <span>Итого за {calculateNights()} ночей:</span>
                        <span className="total-price">{calculateTotalPrice(room)} ₽</span>
                      </div>
                      
                      {!showForm[room.id] ? (
                        <div className="booking-buttons">
                          <button 
                            className="book-online-button"
                            onClick={() => handleBookOnline(room)}
                          >
                            Забронировать онлайн
                          </button>
                          <button 
                            className="book-whatsapp-button"
                            onClick={() => handleBookWhatsApp(room)}
                          >
                            Забронировать через WhatsApp
                          </button>
                        </div>
                      ) : (
                        <BookingForm 
                          room={room}
                          checkIn={checkIn}
                          checkOut={checkOut}
                          guests={guests}
                          services={services}
                          selectedServices={selectedServices}
                          onBookingSuccess={handleBookingSuccess}
                          onBookingError={handleBookingError}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsResultModal; 