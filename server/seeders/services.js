// Скрипт для заполнения базы данных начальными услугами
const db = require('../models');
const Service = db.service;

const seedServices = async () => {
  try {
    // Очищаем таблицу перед добавлением
    await Service.destroy({ where: {} });
    
    // Создаем массив услуг
    const services = [
      {
        name: 'Завтрак',
        description: 'Полноценный завтрак на террасе с видом на горы',
        price: 1000,
        active: true
      },
      {
        name: 'Трансфер',
        description: 'Трансфер из/в аэропорт или ж/д вокзал',
        price: 2500,
        active: true
      },
      {
        name: 'Экскурсия',
        description: 'Экскурсия по окрестностям с гидом',
        price: 3500,
        active: true
      },
      {
        name: 'СПА процедуры',
        description: 'Комплекс СПА процедур в нашем центре',
        price: 5000,
        active: true
      },
      {
        name: 'Аренда велосипеда',
        description: 'Аренда велосипеда на весь день',
        price: 1500,
        active: true
      }
    ];
    
    // Добавляем услуги в базу данных
    for (const service of services) {
      await Service.create(service);
      console.log(`Услуга "${service.name}" успешно добавлена`);
    }
    
    console.log('Все услуги успешно добавлены!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении услуг:', error);
    process.exit(1);
  }
};

// Запускаем функцию
seedServices(); 