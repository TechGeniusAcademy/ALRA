const db = require('./models');
const Room = db.room;

async function updateRoomTypes() {
  try {
    console.log('Начинаем обновление типов комнат...');
    
    // Получаем все комнаты
    const rooms = await Room.findAll();
    console.log(`Найдено ${rooms.length} комнат`);
    
    // Вывод текущих данных комнат
    console.log('Текущие данные комнат:');
    rooms.forEach(room => {
      console.log(`ID: ${room.id}, Название: ${room.title}, Тип: ${room.roomType || 'не задан'}`);
    });
    
    // Обновление типов комнат
    // Предположим, что первая комната - стандарт, вторая - люкс, третья - семейный номер
    const updates = [];
    
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      let roomType;
      
      if (i % 3 === 0) {
        roomType = 'standard';
      } else if (i % 3 === 1) {
        roomType = 'lux';
      } else {
        roomType = 'family';
      }
      
      // Если у комнаты уже есть тип, не меняем его
      if (!room.roomType) {
        room.roomType = roomType;
        await room.save();
        updates.push(`Комната ID: ${room.id} обновлена. Новый тип: ${roomType}`);
      }
    }
    
    console.log('Результаты обновления:');
    if (updates.length > 0) {
      updates.forEach(update => console.log(update));
    } else {
      console.log('Все комнаты уже имеют тип. Обновление не требуется.');
    }
    
    // Проверка после обновления
    const updatedRooms = await Room.findAll();
    console.log('Обновленные данные комнат:');
    updatedRooms.forEach(room => {
      console.log(`ID: ${room.id}, Название: ${room.title}, Тип: ${room.roomType || 'не задан'}`);
    });
    
    console.log('Обновление типов комнат успешно завершено!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при обновлении типов комнат:', error);
    process.exit(1);
  }
}

updateRoomTypes(); 