const db = require('./models');
const fs = require('fs');
const path = require('path');

async function fixBookingController() {
  try {
    // Путь к файлу контроллера бронирований
    const controllerPath = path.join(__dirname, 'controllers', 'booking.controller.js');
    
    // Чтение файла
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Определяем позицию после логирования результата поиска комнаты
    const searchPattern = `console.log('Результат поиска комнаты:', room ? \`Комната найдена, ID: \${room.id}\` : 'Комната не найдена');`;
    const searchForRoomPattern = `const room = await Room.findByPk(roomId);`;
    
    if (content.includes(searchPattern)) {
      console.log('Шаблон для обновления найден в файле');
      
      // Обновляем проверку существования комнаты - добавляем получение всех комнат
      let updatedContent = content.replace(
        searchForRoomPattern,
        `// Проверка существования комнаты с преобразованием ID в число
        const numericRoomId = Number(roomId);
        const room = await Room.findByPk(numericRoomId);`
      );
      
      // Запись обновленного файла
      fs.writeFileSync(controllerPath, updatedContent);
      console.log('Файл контроллера бронирований успешно обновлен!');
    } else {
      console.log('Не удалось найти место для вставки кода');
    }
    
    // Проверяем имеющиеся комнаты
    const rooms = await db.room.findAll({
      attributes: ['id', 'title', 'roomType']
    });
    
    console.log('Доступные комнаты:', rooms.map(r => ({ id: r.id, title: r.title, type: r.roomType })));
    
  } catch (error) {
    console.error('Ошибка при исправлении контроллера:', error);
  }
}

fixBookingController(); 