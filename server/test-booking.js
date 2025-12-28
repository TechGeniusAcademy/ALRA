const axios = require('axios');

// Настройка запроса
const API_URL = 'http://localhost:5000/api';

async function testBooking() {
  try {
    console.log('Тестирование запроса на бронирование с корректным roomId...');
    
    // Данные для бронирования
    const bookingData = {
      roomId: 4, // Используем существующий ID комнаты (Люкс)
      clientName: 'Тестовый Клиент',
      clientEmail: 'test@example.com',
      clientPhone: '+7 123 456 7890',
      checkIn: '2023-08-01',
      checkOut: '2023-08-05',
      guests: 2,
      notes: 'Тестовое бронирование для проверки фикса'
    };
    
    console.log('Отправка запроса с данными:', bookingData);
    
    // Выполнение POST-запроса на бронирование
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    
    console.log('Ответ сервера:', response.data);
    console.log('Тест успешно пройден!');
    
  } catch (error) {
    console.error('Ошибка при тестировании бронирования:');
    
    if (error.response) {
      // Ошибка от сервера
      console.error('Статус ошибки:', error.response.status);
      console.error('Данные ошибки:', error.response.data);
    } else if (error.request) {
      // Ошибка сети
      console.error('Ошибка сети:', error.request);
    } else {
      // Другие ошибки
      console.error('Ошибка:', error.message);
    }
  }
}

// Запуск теста
testBooking(); 