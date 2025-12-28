const db = require('../models');
const Booking = db.booking;
const Room = db.room;
const emailService = require('../utils/emailService');
const { Op } = require('sequelize');

// Создание запроса на бронирование (публичный)
exports.createBooking = async (req, res) => {
  try {
    const { 
      roomId, 
      clientName, 
      clientEmail, 
      clientPhone, 
      checkIn, 
      checkOut, 
      guests, 
      notes,
      services = [] // Массив услуг: [{id: 1, quantity: 2}, {id: 3, quantity: 1}]
    } = req.body;

    console.log('Создание бронирования с данными:', {
      roomId, clientName, clientEmail, clientPhone, checkIn, checkOut, guests, notes, services
    });

    // Дополнительное логирование поиска комнаты
    console.log('Поиск комнаты с ID:', roomId, 'Тип данных ID:', typeof roomId);
    
    // Проверка существования комнаты
    // Проверка существования комнаты с преобразованием ID в число
        const numericRoomId = Number(roomId);
        const room = await Room.findByPk(numericRoomId);
    console.log('Результат поиска комнаты:', room ? `Комната найдена, ID: ${room.id}` : 'Комната не найдена');
    
    // Дополнительно найдем все существующие комнаты для отладки
    const allRooms = await Room.findAll({
      attributes: ['id', 'title', 'roomType']
    });
    console.log('Все комнаты в базе:', allRooms.map(r => ({ id: r.id, title: r.title, type: r.roomType })));
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Выбранный номер не найден'
      });
    }

    // Проверка доступности комнаты на выбранные даты
    const existingBookings = await Booking.findAll({
      where: {
        roomId,
        status: 'confirmed',
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            checkOut: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkIn } },
              { checkOut: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Номер недоступен на выбранные даты'
      });
    }

    // Расчет количества дней
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Расчет общей стоимости
    const totalPrice = parseFloat(room.price) * diffDays;

    // Создание бронирования
    const newBooking = await Booking.create({
      roomId,
      clientName,
      clientEmail,
      clientPhone,
      checkIn,
      checkOut,
      guests,
      status: 'pending',
      totalPrice,
      notes
    });

    // Добавление дополнительных услуг к бронированию
    if (services && services.length > 0) {
      // Получаем информацию о выбранных услугах
      const serviceIds = services.map(s => s.id);
      const availableServices = await db.service.findAll({
        where: {
          id: { [Op.in]: serviceIds },
          active: true
        }
      });

      // Создаем связи между бронированием и услугами
      const bookingServices = [];
      for (const serviceItem of services) {
        const serviceData = availableServices.find(s => s.id === serviceItem.id);
        if (serviceData) {
          bookingServices.push({
            bookingId: newBooking.id,
            serviceId: serviceData.id,
            quantity: serviceItem.quantity || 1,
            price: serviceData.price
          });
        }
      }

      if (bookingServices.length > 0) {
        await db.bookingService.bulkCreate(bookingServices);
        
        // Обновляем общую стоимость бронирования, добавляя стоимость услуг
        const servicesTotal = bookingServices.reduce((sum, item) => {
          return sum + (parseFloat(item.price) * item.quantity);
        }, 0);
        
        newBooking.totalPrice = parseFloat(newBooking.totalPrice) + servicesTotal;
        await newBooking.save();
      }
    }

    // Отправка уведомления (админу и клиенту)
    try {
      // Отправка уведомления админу
      await emailService.sendAdminBookingNotification(newBooking, room);
      
      // Отправка подтверждения клиенту
      await emailService.sendBookingConfirmation(newBooking, room);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Продолжаем выполнение, даже если отправка email не удалась
    }

    return res.status(201).json({
      success: true,
      message: 'Бронирование успешно создано',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при создании бронирования',
      error: error.message
    });
  }
};

// Получение всех бронирований (только для админа)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;
    
    const whereClause = {};
    
    // Фильтрация по статусу
    if (status) {
      whereClause.status = status;
    }
    
    // Фильтрация по датам
    if (fromDate && toDate) {
      whereClause[Op.or] = [
        {
          checkIn: {
            [Op.between]: [fromDate, toDate]
          }
        },
        {
          checkOut: {
            [Op.between]: [fromDate, toDate]
          }
        }
      ];
    } else if (fromDate) {
      whereClause.checkIn = {
        [Op.gte]: fromDate
      };
    } else if (toDate) {
      whereClause.checkOut = {
        [Op.lte]: toDate
      };
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Room,
          attributes: ['id', 'title', 'price']
        },
        {
          model: db.service,
          through: { attributes: ['quantity', 'price'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Ошибка получения списка бронирований:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение информации о конкретном бронировании (только для админа)
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Room,
          attributes: ['id', 'title', 'price', 'capacity', 'status', 'roomType', 'description', 'amenities'],
          include: [
            {
              model: db.roomImage,
              as: 'images',
              attributes: ['id', 'imageUrl', 'isMain']
            }
          ]
        },
        {
          model: db.service,
          through: { attributes: ['quantity', 'price'] }
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Расчет общей стоимости бронирования
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
    
    let roomTotal = 0;
    if (booking.room) {
      roomTotal = booking.room.price * nights;
    }
    
    let servicesTotal = 0;
    if (booking.services && booking.services.length > 0) {
      servicesTotal = booking.services.reduce((total, service) => {
        const servicePrice = service.bookingService ? service.bookingService.price : service.price;
        const quantity = service.bookingService ? service.bookingService.quantity : 1;
        return total + (servicePrice * quantity);
      }, 0);
    }
    
    const totalAmount = roomTotal + servicesTotal;

    // Добавляем расчеты в ответ
    const bookingData = booking.toJSON();
    bookingData.calculatedTotal = {
      roomTotal,
      servicesTotal,
      totalAmount,
      nights
    };

    return res.status(200).json({
      success: true,
      data: bookingData
    });
  } catch (error) {
    console.error('Ошибка получения информации о бронировании:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обновление статуса бронирования (только для админа)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Room,
          attributes: ['id', 'title', 'price', 'capacity']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Обновление данных
    await booking.update({
      status: status || booking.status,
      paymentStatus: paymentStatus || booking.paymentStatus,
      notes: notes !== undefined ? notes : booking.notes
    });

    // Если статус изменен на 'confirmed', обновить статус комнаты на 'occupied'
    if (status === 'confirmed' && booking.room) {
      await booking.room.update({ status: 'occupied' });
    }
    
    // Если статус изменен на 'cancelled' или 'completed', вернуть статус комнаты на 'available'
    if ((status === 'cancelled' || status === 'completed') && booking.room) {
      await booking.room.update({ status: 'available' });
    }

    // Если статус изменен на 'confirmed', отправить подтверждение
    if (status === 'confirmed' && booking.status !== 'confirmed') {
      await emailService.sendBookingConfirmation(booking, booking.room);
    }

    return res.status(200).json({
      success: true,
      message: 'Информация о бронировании успешно обновлена',
      data: booking
    });
  } catch (error) {
    console.error('Ошибка обновления информации о бронировании:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Отмена бронирования (только для админа)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    await booking.destroy();

    return res.status(200).json({
      success: true,
      message: 'Бронирование успешно удалено'
    });
  } catch (error) {
    console.error('Ошибка удаления бронирования:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Проверка доступности комнаты (публичный)
exports.checkAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkIn, checkOut } = req.query;

    // Проверка существования комнаты
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    // Проверка доступности комнаты на выбранные даты
    const existingBookings = await Booking.findAll({
      where: {
        roomId,
        status: 'confirmed',
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            checkOut: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkIn } },
              { checkOut: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    return res.status(200).json({
      success: true,
      available: existingBookings.length === 0,
      message: existingBookings.length === 0 ? 'Комната доступна для бронирования' : 'Комната недоступна на выбранные даты'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при проверке доступности',
      error: error.message
    });
  }
}; 