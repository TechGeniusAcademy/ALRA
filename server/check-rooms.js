const db = require('./models');

async function checkRooms() {
  try {
    // Проверка подключения к БД
    await db.sequelize.authenticate();
    console.log('Состояние подключения: подключено');

    // Запрос всех комнат
    const rooms = await db.room.findAll({
      attributes: ['id', 'title', 'roomType', 'status', 'price', 'capacity']
    });

    console.log('Все комнаты в базе:', 
      rooms.map(r => ({ 
        id: r.id, 
        title: r.title, 
        type: r.roomType,
        status: r.status,
        price: r.price,
        capacity: r.capacity
      }))
    );
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    // Закрыть соединение с БД
    await db.sequelize.close();
  }
}

checkRooms(); 