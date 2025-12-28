const db = require('./models');
const Room = db.room;

async function fixRoomTypes() {
  try {
    console.log('Начинаем исправление типов комнат...');
    
    // Исправляем типы комнат - обновлено для существующих комнат
    const updates = [
      { id: 4, roomType: 'lux' },
      { id: 5, roomType: 'standard' }
    ];
    
    for (const update of updates) {
      const room = await Room.findByPk(update.id);
      if (room) {
        await room.update({ roomType: update.roomType });
        console.log(`Комната ID: ${room.id}, Название: ${room.title} обновлена. Новый тип: ${update.roomType}`);
      } else {
        console.log(`Комната с ID ${update.id} не найдена`);
      }
    }
    
    // Проверка после обновления
    const updatedRooms = await Room.findAll();
    console.log('Обновленные данные комнат:');
    updatedRooms.forEach(room => {
      console.log(`ID: ${room.id}, Название: ${room.title}, Тип: ${room.roomType}`);
    });
    
    console.log('Исправление типов комнат успешно завершено!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при исправлении типов комнат:', error);
    process.exit(1);
  }
}

fixRoomTypes(); 