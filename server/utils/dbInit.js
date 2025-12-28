const bcrypt = require('bcryptjs');
const db = require('../models');
const Administrator = db.administrator;
const Room = db.room;
const RoomImage = db.roomImage;
const Content = db.content;

// Функция для начальной настройки базы данных
async function initializeDatabase() {
  try {
    console.log('Начало инициализации базы данных...');
    
    // Создание таблиц в базе данных
    await db.sequelize.sync({ force: true });
    console.log('Таблицы базы данных созданы');
    
    // Создание администратора по умолчанию
    const adminPassword = 'admin123';
    const hashedPassword = bcrypt.hashSync(adminPassword, 8);
    
    const admin = await Administrator.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@alra-eco.com'
    });
    
    console.log('Администратор по умолчанию создан:', {
      username: admin.username,
      email: admin.email,
      password: adminPassword // Это пароль только для первоначальной настройки
    });
    
    // Создание тестовых комнат
    const room1 = await Room.create({
      title: 'Стандартный номер',
      description: 'Размещение 2 взрослых (плюс 1 место за дополнительную плату). В номере есть все необходимое: холодильник, чайник, столовые приборы, телевизор, wi-fi, кондиционер, вешалка, фен, ванная комната, с/у. Панорамное остекление. Веранда с уличной мебелью.',
      price: 5000,
      capacity: 2,
      amenities: JSON.stringify([
        'Холодильник',
        'Чайник',
        'Телевизор',
        'Wi-Fi',
        'Кондиционер',
        'Фен',
        'Ванная комната',
        'Веранда'
      ])
    });
    
    // Добавление изображений для комнаты
    await RoomImage.create({
      roomId: room1.id,
      imageUrl: 'https://i.postimg.cc/B6Q5ym4s/Frame-1499.png',
      isMain: true
    });
    
    await RoomImage.create({
      roomId: room1.id,
      imageUrl: 'https://i.postimg.cc/28FQkpym/Frame-1500.png',
      isMain: false
    });
    
    console.log('Тестовая комната создана:', room1.title);
    
    // Создание контента для главной страницы
    await Content.create({
      page: 'home',
      section: 'about',
      content: JSON.stringify({
        title: 'Мы создаем новую культуру туризма и сервис высочайшего уровня',
        text: 'ЭКО-ОТЕЛЬ "ALRA" — это уникальное место, которое сочетает в себе комфорт и заботу о природе. Удачное расположение коттеджей позволяет насладиться живописными пейзажами и уединением.'
      })
    });
    
    console.log('Тестовый контент создан');
    
    console.log('Инициализация базы данных завершена успешно');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
  } finally {
    process.exit();
  }
}

// Запуск инициализации
initializeDatabase(); 