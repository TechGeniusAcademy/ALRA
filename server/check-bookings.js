const db = require('./models');

async function checkBookings() {
  try {
    // Проверка подключения к БД
    await db.sequelize.authenticate();
    console.log('Состояние подключения: подключено');

    // Запрос всех бронирований с roomId = 2
    const bookings = await db.booking.findAll({
      where: {
        roomId: 2
      },
      attributes: ['id', 'roomId', 'clientName', 'checkIn', 'checkOut', 'status']
    });

    console.log(`Найдено бронирований для комнаты с ID 2: ${bookings.length}`);
    if (bookings.length > 0) {
      console.log('Бронирования:', bookings);
    }

    // Запрос всех бронирований
    const allBookings = await db.booking.findAll({
      attributes: ['id', 'roomId', 'clientName', 'checkIn', 'checkOut', 'status']
    });

    console.log(`Всего бронирований в системе: ${allBookings.length}`);
    if (allBookings.length > 0) {
      console.log('Все бронирования:', allBookings.map(b => ({
        id: b.id,
        roomId: b.roomId,
        clientName: b.clientName,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status
      })));
    }
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    // Закрыть соединение с БД
    await db.sequelize.close();
  }
}

checkBookings(); 