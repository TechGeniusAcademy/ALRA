import React, { createContext, useState, useContext, useEffect } from 'react';
import roomService from '../services/roomService';

// Создаем контекст
const BookingContext = createContext();

// Создаем провайдер контекста
export const BookingProvider = ({ children }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({
    id: 4,
    title: 'Стандартный номер',
    price: 20000
  });
  
  // Запрос доступных комнат при инициализации
  useEffect(() => {
    fetchDefaultRoom();
  }, []);
  
  // Получаем первую доступную комнату из API
  const fetchDefaultRoom = async () => {
    try {
      const response = await roomService.getAllAvailableRooms();
      if (response.data && response.data.length > 0) {
        const firstRoom = response.data[0];
        setSelectedRoom({
          id: firstRoom.id,
          title: firstRoom.title,
          price: firstRoom.price
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки доступных комнат:', error);
    }
  };
  
  // Функция для открытия модального окна бронирования
  const openBookingModal = (room = null) => {
    if (room) {
      setSelectedRoom(room);
    }
    setShowBookingModal(true);
  };
  
  // Функция для закрытия модального окна бронирования
  const closeBookingModal = () => {
    setShowBookingModal(false);
  };
  
  // Значения, которые будут доступны через контекст
  const contextValue = {
    showBookingModal,
    selectedRoom,
    openBookingModal,
    closeBookingModal
  };
  
  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// Хук для использования контекста бронирования
export const useBooking = () => {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking должен использоваться внутри BookingProvider');
  }
  
  return context;
};

export default BookingContext; 